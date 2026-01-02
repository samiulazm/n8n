import { NodeConnectionTypes } from 'n8n-workflow';
import type {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeListSearchItems,
	INodeListSearchResult,
	INodePropertyOptions,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';

import { companyFields, companyOperations } from './CompanyDescription';
import { contactFields, contactOperations } from './ContactDescription';
import { dealFields, dealOperations } from './DealDescription';
import { ticketFields, ticketOperations } from './TicketDescription';
import { associationFields, associationOperations } from './AssociationDescription';
import { productFields, productOperations } from './ProductDescription';
import { lineItemFields, lineItemOperations } from './LineItemDescription';
import {
	clean,
	hubspotApiRequest,
	hubspotApiRequestAllItems,
	validateCredentials,
} from './GenericFunctions';
import { buildFilterGroups, buildSorts } from './SearchUtils';
import { generatePairedItemData } from '../../../utils/utilities';

export class HubspotV3 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			group: ['output'],
			version: [3, 3.1],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			defaults: {
				name: 'HubSpot V3',
			},
			usableAsTool: true,
			inputs: [NodeConnectionTypes.Main],
			outputs: [NodeConnectionTypes.Main],
			credentials: [
				{
					name: 'hubspotApi',
					required: true,
					testedBy: 'hubspotApiTest',
					displayOptions: {
						show: {
							authentication: ['apiKey'],
						},
					},
				},
				{
					name: 'hubspotAppToken',
					required: true,
					testedBy: 'hubspotApiTest',
					displayOptions: {
						show: {
							authentication: ['appToken'],
						},
					},
				},
				{
					name: 'hubspotOAuth2Api',
					required: true,
					displayOptions: {
						show: {
							authentication: ['oAuth2'],
						},
					},
				},
			],
			properties: [
				{
					displayName: 'Authentication',
					name: 'authentication',
					type: 'options',
					options: [
						{
							name: 'API Key',
							value: 'apiKey',
						},
						{
							name: 'APP Token',
							value: 'appToken',
						},
						{
							name: 'OAuth2',
							value: 'oAuth2',
						},
					],
					default: 'apiKey',
				},
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{
							name: 'Association',
							value: 'association',
						},
						{
							name: 'Company',
							value: 'company',
						},
						{
							name: 'Contact',
							value: 'contact',
						},
						{
							name: 'Deal',
							value: 'deal',
						},
						{
							name: 'Line Item',
							value: 'lineItem',
						},
						{
							name: 'Product',
							value: 'product',
						},
						{
							name: 'Ticket',
							value: 'ticket',
						},
					],
					default: 'contact',
				},
				// CONTACT
				...contactOperations,
				...contactFields,
				// COMPANY
				...companyOperations,
				...companyFields,
				// DEAL
				...dealOperations,
				...dealFields,
				// TICKET
				...ticketOperations,
				...ticketFields,
				// ASSOCIATION
				...associationOperations,
				...associationFields,
				// PRODUCT
				...productOperations,
				...productFields,
				// LINE ITEM
				...lineItemOperations,
				...lineItemFields,
			],
		};
	}

	methods = {
		credentialTest: {
			async hubspotApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				try {
					await validateCredentials.call(this, credential.data as ICredentialDataDecryptedObject);
				} catch (error) {
					const err = error as JsonObject;
					if (err.statusCode === 401) {
						return {
							status: 'Error',
							message: 'Invalid credentials',
						};
					}
				}
				return {
					status: 'OK',
					message: 'Authentication successful',
				};
			},
		},
		loadOptions: {
			/* -------------------------------------------------------------------------- */
			/*                                 COMMON                                    */
			/* -------------------------------------------------------------------------- */
			async getOwners(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/owners';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const owner of results) {
					const ownerName = owner.email || owner.id;
					const ownerId = isNaN(parseInt(owner.id)) ? owner.id : parseInt(owner.id);
					returnData.push({
						name: ownerName,
						value: ownerId,
					});
				}
				return returnData;
			},
			async getCompanyProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/properties/companies';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const property of results) {
					returnData.push({
						name: property.label,
						value: property.name,
					});
				}
				return returnData.sort((a, b) => (a.name < b.name ? -1 : 1));
			},
			async getContactProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/properties/contacts';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const property of results) {
					returnData.push({
						name: property.label,
						value: property.name,
					});
				}
				return returnData.sort((a, b) => (a.name < b.name ? -1 : 1));
			},
			async getDealProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/properties/deals';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const property of results) {
					returnData.push({
						name: property.label,
						value: property.name,
					});
				}
				return returnData.sort((a, b) => (a.name < b.name ? -1 : 1));
			},
			async getDealPipelines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/pipelines/deals';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const pipeline of results) {
					returnData.push({
						name: pipeline.label,
						value: pipeline.id,
					});
				}
				return returnData;
			},
			async getDealStages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/pipelines/deals';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const pipeline of results) {
					for (const stage of pipeline.stages) {
						returnData.push({
							name: `${pipeline.label} - ${stage.label}`,
							value: stage.id,
						});
					}
				}
				return returnData;
			},
			async getTicketProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/properties/tickets';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const property of results) {
					returnData.push({
						name: property.label,
						value: property.name,
					});
				}
				return returnData.sort((a, b) => (a.name < b.name ? -1 : 1));
			},
			async getTicketPipelines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/pipelines/tickets';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const pipeline of results) {
					returnData.push({
						name: pipeline.label,
						value: pipeline.id,
					});
				}
				return returnData;
			},
			async getTicketStages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/pipelines/tickets';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const pipeline of results) {
					for (const stage of pipeline.stages) {
						returnData.push({
							name: `${pipeline.label} - ${stage.label}`,
							value: stage.id,
						});
					}
				}
				return returnData;
			},
			async getTicketPriorities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/properties/tickets';
				const properties = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const property of properties.results || []) {
					if (property.name === 'hs_ticket_priority' && property.options) {
						for (const option of property.options) {
							returnData.push({
								name: option.label,
								value: option.value,
							});
						}
					}
				}
				return returnData;
			},
			async getTicketSources(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/properties/tickets';
				const properties = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const property of properties.results || []) {
					if (property.name === 'source_type' && property.options) {
						for (const option of property.options) {
							returnData.push({
								name: option.label,
								value: option.value,
							});
						}
					}
				}
				return returnData.sort((a, b) => (a.name < b.name ? -1 : 1));
			},
			async getProductProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/properties/products';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const property of results) {
					returnData.push({
						name: property.label,
						value: property.name,
					});
				}
				return returnData.sort((a, b) => (a.name < b.name ? -1 : 1));
			},
			async getLineItemProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/crm/v3/properties/line_items';
				const { results } = await hubspotApiRequest.call(this, 'GET', endpoint, {});
				for (const property of results) {
					returnData.push({
						name: property.label,
						value: property.name,
					});
				}
				return returnData.sort((a, b) => (a.name < b.name ? -1 : 1));
			},
		},
		listSearch: {
			async searchCompanies(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const endpoint = '/crm/v3/objects/companies/search';
				const body = {
					query: '',
					limit: 10,
					properties: ['name', 'domain'],
				};
				const response = await hubspotApiRequest.call(this, 'POST', endpoint, body);
				return {
					results: (response.results || []).map((company: any) => ({
						name: company.properties?.name?.value || company.id,
						value: company.id,
					})),
				};
			},
			async searchContacts(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const endpoint = '/crm/v3/objects/contacts/search';
				const body = {
					query: filter || '',
					limit: 10,
					properties: ['email', 'firstname', 'lastname'],
				};
				const response = await hubspotApiRequest.call(this, 'POST', endpoint, body);
				const results: INodeListSearchItems[] = (response.results || [])
					.map((contact: any) => ({
						name: contact.properties?.email?.value || contact.id,
						value: contact.id,
					}))
					.filter(
						(c: INodeListSearchItems) =>
							!filter ||
							c.name.toString().toLowerCase().includes(filter.toString().toLowerCase()) ||
							c.value?.toString() === filter,
					);
				return { results };
			},
			async searchDeals(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const endpoint = '/crm/v3/objects/deals/search';
				const body = {
					query: filter || '',
					limit: 10,
					properties: ['dealname'],
				};
				const response = await hubspotApiRequest.call(this, 'POST', endpoint, body);
				const results: INodeListSearchItems[] = (response.results || [])
					.map((deal: any) => ({
						name: deal.properties?.dealname?.value || deal.id,
						value: deal.id,
					}))
					.filter(
						(c: INodeListSearchItems) =>
							!filter ||
							c.name.toString().toLowerCase().includes(filter.toString().toLowerCase()) ||
							c.value?.toString() === filter,
					);
				return { results };
			},
			async searchTickets(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const endpoint = '/crm/v3/objects/tickets/search';
				const body = {
					query: filter || '',
					limit: 10,
					properties: ['hs_ticket_name'],
				};
				const response = await hubspotApiRequest.call(this, 'POST', endpoint, body);
				const results: INodeListSearchItems[] = (response.results || [])
					.map((ticket: any) => ({
						name: ticket.properties?.hs_ticket_name?.value || ticket.id,
						value: ticket.id,
					}))
					.filter(
						(c: INodeListSearchItems) =>
							!filter ||
							c.name.toString().toLowerCase().includes(filter.toString().toLowerCase()) ||
							c.value?.toString() === filter,
					);
				return { results };
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;
		const qs: IDataObject = {};
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				// Reset qs for each item to avoid values persisting across iterations
				Object.keys(qs).forEach((key) => delete qs[key]);
				/* -------------------------------------------------------------------------- */
				/*                                 COMPANY                                   */
				/* -------------------------------------------------------------------------- */
				if (resource === 'company') {
					// Create company
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const properties: Record<string, unknown> = {
							name,
							...additionalFields,
						};
						clean(properties);
						const body = {
							properties,
						};
						const endpoint = '/crm/v3/objects/companies';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
					}
					// Get company
					if (operation === 'get') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						const properties = this.getNodeParameter('properties', i) as string[];
						const propertiesWithHistory = this.getNodeParameter(
							'propertiesWithHistory',
							i,
						) as string[];
						const associations = this.getNodeParameter('associations', i) as string[];
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						qs.propertiesWithHistory =
							propertiesWithHistory.length > 0 ? propertiesWithHistory.join(',') : undefined;
						qs.associations = associations.length > 0 ? associations.join(',') : undefined;
						clean(qs);
						const endpoint = `/crm/v3/objects/companies/${companyId}`;
						responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
					}
					// Get all companies
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						if (filters.createdAfter) {
							qs.createdAfter = new Date(filters.createdAfter as string).getTime();
						}
						if (filters.createdBefore) {
							qs.createdBefore = new Date(filters.createdBefore as string).getTime();
						}
						if (filters.updatedAfter) {
							qs.updatedAfter = new Date(filters.updatedAfter as string).getTime();
						}
						if (filters.updatedBefore) {
							qs.updatedBefore = new Date(filters.updatedBefore as string).getTime();
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/companies';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'GET',
								endpoint,
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', 0);
							responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = responseData.results || [];
						}
					}
					// Search companies
					if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filterGroupsUi = this.getNodeParameter('filterGroupsUi', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const sortBy = additionalFields?.sortBy as string;
						const direction = additionalFields?.direction as string;

						const body: IDataObject = {
							properties: properties.length > 0 ? properties : ['name', 'domain'],
						};

						if (query) {
							body.query = query;
						}

						const filterGroups = buildFilterGroups(filterGroupsUi);
						if (filterGroups) {
							body.filterGroups = filterGroups;
						}

						const sorts = buildSorts(sortBy, direction);
						if (sorts) {
							body.sorts = sorts;
						}

						const endpoint = '/crm/v3/objects/companies/search';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'POST',
								endpoint,
								body,
							);
						} else {
							body.limit = this.getNodeParameter('limit', i);
							responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
							responseData = responseData.results || [];
						}
					}
					// Update company
					if (operation === 'update') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						clean(additionalFields);
						const body = {
							properties: additionalFields,
						};
						const endpoint = `/crm/v3/objects/companies/${companyId}`;
						responseData = await hubspotApiRequest.call(this, 'PATCH', endpoint, body);
					}
					// Delete company
					if (operation === 'delete') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						const endpoint = `/crm/v3/objects/companies/${companyId}`;
						await hubspotApiRequest.call(this, 'DELETE', endpoint);
						responseData = { id: companyId, deleted: true };
					}
					// Batch operations
					if (operation === 'batchCreate') {
						const companies = this.getNodeParameter('companies', i) as IDataObject;
						const companyValues = (companies.companyValues as IDataObject[]) || [];
						const inputs = companyValues.map((company) => {
							const props: Record<string, unknown> = { ...company };
							delete props.id;
							clean(props);
							return { properties: props };
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/companies/batch/create';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					if (operation === 'batchUpdate') {
						const companies = this.getNodeParameter('companies', i) as IDataObject;
						const companyValues = (companies.companyValues as IDataObject[]) || [];
						const inputs = companyValues.map((company) => {
							const props = (company.properties as IDataObject) || {};
							clean(props);
							return {
								id: company.id,
								properties: props,
							};
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/companies/batch/update';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					if (operation === 'batchRead') {
						const companyIds = (this.getNodeParameter('companyIds', i) as string).split(',');
						const properties = this.getNodeParameter('properties', i) as string[];
						const body: IDataObject = {
							inputs: companyIds.map((id) => ({ id })),
						};
						if (properties.length > 0) {
							qs.properties = properties.join(',');
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/companies/batch/read';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body, qs);
						responseData = responseData.results || [];
					}
					if (operation === 'batchDelete') {
						const companyIds = (this.getNodeParameter('companyIds', i) as string).split(',');
						const body = { inputs: companyIds.map((id) => ({ id })) };
						const endpoint = '/crm/v3/objects/companies/batch/archive';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = { deleted: companyIds };
					}
				}

				/* -------------------------------------------------------------------------- */
				/*                                 CONTACT                                   */
				/* -------------------------------------------------------------------------- */
				if (resource === 'contact') {
					// Create contact
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const properties: Record<string, unknown> = {
							email,
							...additionalFields,
						};
						clean(properties);
						const body = {
							properties,
						};
						const endpoint = '/crm/v3/objects/contacts';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
					}
					// Upsert contact
					if (operation === 'upsert') {
						const email = this.getNodeParameter('email', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const properties: Record<string, unknown> = {
							email,
							...additionalFields,
						};
						clean(properties);
						const body = {
							properties,
						};
						// For upsert, we search first, then create or update
						const searchEndpoint = '/crm/v3/objects/contacts/search';
						const searchBody = {
							query: `email:${email}`,
							limit: 1,
							properties: ['email'],
						};
						try {
							const searchResponse = await hubspotApiRequest.call(
								this,
								'POST',
								searchEndpoint,
								searchBody,
							);
							if (searchResponse.results && searchResponse.results.length > 0) {
								// Update existing
								const contactId = searchResponse.results[0].id;
								const endpoint = `/crm/v3/objects/contacts/${contactId}`;
								responseData = await hubspotApiRequest.call(this, 'PATCH', endpoint, body);
							} else {
								// Create new
								const endpoint = '/crm/v3/objects/contacts';
								responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
							}
						} catch (error) {
							// If search fails, try to create
							const endpoint = '/crm/v3/objects/contacts';
							responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						}
					}
					// Get contact
					if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const properties = this.getNodeParameter('properties', i) as string[];
						const propertiesWithHistory = this.getNodeParameter(
							'propertiesWithHistory',
							i,
						) as string[];
						const associations = this.getNodeParameter('associations', i) as string[];
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						qs.propertiesWithHistory =
							propertiesWithHistory.length > 0 ? propertiesWithHistory.join(',') : undefined;
						qs.associations = associations.length > 0 ? associations.join(',') : undefined;
						clean(qs);
						const endpoint = `/crm/v3/objects/contacts/${contactId}`;
						responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
					}
					// Get all contacts
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						if (filters.createdAfter) {
							qs.createdAfter = new Date(filters.createdAfter as string).getTime();
						}
						if (filters.createdBefore) {
							qs.createdBefore = new Date(filters.createdBefore as string).getTime();
						}
						if (filters.updatedAfter) {
							qs.updatedAfter = new Date(filters.updatedAfter as string).getTime();
						}
						if (filters.updatedBefore) {
							qs.updatedBefore = new Date(filters.updatedBefore as string).getTime();
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/contacts';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'GET',
								endpoint,
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', 0);
							responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = responseData.results || [];
						}
					}
					// Search contacts
					if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filterGroupsUi = this.getNodeParameter('filterGroupsUi', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const sortBy = additionalFields?.sortBy as string;
						const direction = additionalFields?.direction as string;

						const body: IDataObject = {
							properties: properties.length > 0 ? properties : ['email', 'firstname', 'lastname'],
						};

						// Add query if provided
						if (query) {
							body.query = query;
						}

						// Add filterGroups if provided
						const filterGroups = buildFilterGroups(filterGroupsUi);
						if (filterGroups) {
							body.filterGroups = filterGroups;
						}

						// Add sorts if provided
						const sorts = buildSorts(sortBy, direction);
						if (sorts) {
							body.sorts = sorts;
						}

						const endpoint = '/crm/v3/objects/contacts/search';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'POST',
								endpoint,
								body,
							);
						} else {
							body.limit = this.getNodeParameter('limit', i);
							responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
							responseData = responseData.results || [];
						}
					}
					// Update contact
					if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						clean(additionalFields);
						const body = {
							properties: additionalFields,
						};
						const endpoint = `/crm/v3/objects/contacts/${contactId}`;
						responseData = await hubspotApiRequest.call(this, 'PATCH', endpoint, body);
					}
					// Delete contact
					if (operation === 'delete') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const endpoint = `/crm/v3/objects/contacts/${contactId}`;
						await hubspotApiRequest.call(this, 'DELETE', endpoint);
						responseData = { id: contactId, deleted: true };
					}
					// Batch operations (similar pattern as companies)
					if (operation === 'batchCreate') {
						const contacts = this.getNodeParameter('contacts', i) as IDataObject;
						const contactValues = (contacts.contactValues as IDataObject[]) || [];
						const inputs = contactValues.map((contact) => {
							const props: Record<string, unknown> = { ...contact };
							delete props.id;
							clean(props);
							return { properties: props };
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/contacts/batch/create';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					if (operation === 'batchUpdate') {
						const contacts = this.getNodeParameter('contacts', i) as IDataObject;
						const contactValues = (contacts.contactValues as IDataObject[]) || [];
						const inputs = contactValues.map((contact) => {
							const props = (contact.properties as IDataObject) || {};
							clean(props);
							return {
								id: contact.id,
								properties: props,
							};
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/contacts/batch/update';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					if (operation === 'batchRead') {
						const contactIds = (this.getNodeParameter('contactIds', i) as string).split(',');
						const properties = this.getNodeParameter('properties', i) as string[];
						const body: IDataObject = {
							inputs: contactIds.map((id) => ({ id })),
						};
						if (properties.length > 0) {
							qs.properties = properties.join(',');
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/contacts/batch/read';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body, qs);
						responseData = responseData.results || [];
					}
					if (operation === 'batchDelete') {
						const contactIds = (this.getNodeParameter('contactIds', i) as string).split(',');
						const body = { inputs: contactIds.map((id) => ({ id })) };
						const endpoint = '/crm/v3/objects/contacts/batch/archive';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = { deleted: contactIds };
					}
				}

				/* -------------------------------------------------------------------------- */
				/*                                 DEAL                                      */
				/* -------------------------------------------------------------------------- */
				if (resource === 'deal') {
					// Create deal
					if (operation === 'create') {
						const dealname = this.getNodeParameter('dealname', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const properties: Record<string, unknown> = {
							dealname,
							...additionalFields,
						};
						clean(properties);
						const body = {
							properties,
						};
						const endpoint = '/crm/v3/objects/deals';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
					}
					// Get deal
					if (operation === 'get') {
						const dealId = this.getNodeParameter('dealId', i) as string;
						const properties = this.getNodeParameter('properties', i) as string[];
						const propertiesWithHistory = this.getNodeParameter(
							'propertiesWithHistory',
							i,
						) as string[];
						const associations = this.getNodeParameter('associations', i) as string[];
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						qs.propertiesWithHistory =
							propertiesWithHistory.length > 0 ? propertiesWithHistory.join(',') : undefined;
						qs.associations = associations.length > 0 ? associations.join(',') : undefined;
						clean(qs);
						const endpoint = `/crm/v3/objects/deals/${dealId}`;
						responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
					}
					// Get all deals
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						if (filters.createdAfter) {
							qs.createdAfter = new Date(filters.createdAfter as string).getTime();
						}
						if (filters.createdBefore) {
							qs.createdBefore = new Date(filters.createdBefore as string).getTime();
						}
						if (filters.updatedAfter) {
							qs.updatedAfter = new Date(filters.updatedAfter as string).getTime();
						}
						if (filters.updatedBefore) {
							qs.updatedBefore = new Date(filters.updatedBefore as string).getTime();
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/deals';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'GET',
								endpoint,
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', 0);
							responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = responseData.results || [];
						}
					}
					// Search deals
					if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filterGroupsUi = this.getNodeParameter('filterGroupsUi', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const sortBy = additionalFields?.sortBy as string;
						const direction = additionalFields?.direction as string;

						const body: IDataObject = {
							properties: properties.length > 0 ? properties : ['dealname', 'amount', 'dealstage'],
						};

						if (query) {
							body.query = query;
						}

						const filterGroups = buildFilterGroups(filterGroupsUi);
						if (filterGroups) {
							body.filterGroups = filterGroups;
						}

						const sorts = buildSorts(sortBy, direction);
						if (sorts) {
							body.sorts = sorts;
						}

						const endpoint = '/crm/v3/objects/deals/search';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'POST',
								endpoint,
								body,
							);
						} else {
							body.limit = this.getNodeParameter('limit', i);
							responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
							responseData = responseData.results || [];
						}
					}
					// Update deal
					if (operation === 'update') {
						const dealId = this.getNodeParameter('dealId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						clean(additionalFields);
						const body = {
							properties: additionalFields,
						};
						const endpoint = `/crm/v3/objects/deals/${dealId}`;
						responseData = await hubspotApiRequest.call(this, 'PATCH', endpoint, body);
					}
					// Delete deal
					if (operation === 'delete') {
						const dealId = this.getNodeParameter('dealId', i) as string;
						const endpoint = `/crm/v3/objects/deals/${dealId}`;
						await hubspotApiRequest.call(this, 'DELETE', endpoint);
						responseData = { id: dealId, deleted: true };
					}
					// Batch operations (similar pattern as companies and contacts)
					if (operation === 'batchCreate') {
						const deals = this.getNodeParameter('deals', i) as IDataObject;
						const dealValues = (deals.dealValues as IDataObject[]) || [];
						const inputs = dealValues.map((deal) => {
							const props: Record<string, unknown> = { ...deal };
							delete props.id;
							clean(props);
							return { properties: props };
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/deals/batch/create';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					if (operation === 'batchUpdate') {
						const deals = this.getNodeParameter('deals', i) as IDataObject;
						const dealValues = (deals.dealValues as IDataObject[]) || [];
						const inputs = dealValues.map((deal) => {
							const props = (deal.properties as IDataObject) || {};
							clean(props);
							return {
								id: deal.id,
								properties: props,
							};
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/deals/batch/update';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					if (operation === 'batchRead') {
						const dealIds = (this.getNodeParameter('dealIds', i) as string).split(',');
						const properties = this.getNodeParameter('properties', i) as string[];
						const body: IDataObject = {
							inputs: dealIds.map((id) => ({ id })),
						};
						if (properties.length > 0) {
							qs.properties = properties.join(',');
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/deals/batch/read';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body, qs);
						responseData = responseData.results || [];
					}
					if (operation === 'batchDelete') {
						const dealIds = (this.getNodeParameter('dealIds', i) as string).split(',');
						const body = { inputs: dealIds.map((id) => ({ id })) };
						const endpoint = '/crm/v3/objects/deals/batch/archive';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = { deleted: dealIds };
					}
				}

				/* -------------------------------------------------------------------------- */
				/*                                 TICKET                                     */
				/* -------------------------------------------------------------------------- */
				if (resource === 'ticket') {
					// Create ticket
					if (operation === 'create') {
						const ticketName = this.getNodeParameter('hs_ticket_name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const properties: Record<string, unknown> = {
							hs_ticket_name: ticketName,
							...additionalFields,
						};
						clean(properties);
						const body = {
							properties,
						};
						const endpoint = '/crm/v3/objects/tickets';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
					}
					// Get ticket
					if (operation === 'get') {
						const ticketId = this.getNodeParameter('ticketId', i) as string;
						const properties = this.getNodeParameter('properties', i) as string[];
						const propertiesWithHistory = this.getNodeParameter(
							'propertiesWithHistory',
							i,
						) as string[];
						const associations = this.getNodeParameter('associations', i) as string[];
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						qs.propertiesWithHistory =
							propertiesWithHistory.length > 0 ? propertiesWithHistory.join(',') : undefined;
						qs.associations = associations.length > 0 ? associations.join(',') : undefined;
						clean(qs);
						const endpoint = `/crm/v3/objects/tickets/${ticketId}`;
						responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
					}
					// Get all tickets
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						clean(qs);
						const endpoint = '/crm/v3/objects/tickets';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'GET',
								endpoint,
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', 0);
							responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = responseData.results || [];
						}
					}
					// Search tickets
					if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filterGroupsUi = this.getNodeParameter('filterGroupsUi', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const sortBy = additionalFields?.sortBy as string;
						const direction = additionalFields?.direction as string;

						const body: IDataObject = {
							properties:
								properties.length > 0 ? properties : ['hs_ticket_name', 'hs_ticket_priority'],
						};

						if (query) {
							body.query = query;
						}

						const filterGroups = buildFilterGroups(filterGroupsUi);
						if (filterGroups) {
							body.filterGroups = filterGroups;
						}

						const sorts = buildSorts(sortBy, direction);
						if (sorts) {
							body.sorts = sorts;
						}

						const endpoint = '/crm/v3/objects/tickets/search';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'POST',
								endpoint,
								body,
							);
						} else {
							body.limit = this.getNodeParameter('limit', i);
							responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
							responseData = responseData.results || [];
						}
					}
					// Update ticket
					if (operation === 'update') {
						const ticketId = this.getNodeParameter('ticketId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						clean(additionalFields);
						const body = {
							properties: additionalFields,
						};
						const endpoint = `/crm/v3/objects/tickets/${ticketId}`;
						responseData = await hubspotApiRequest.call(this, 'PATCH', endpoint, body);
					}
					// Delete ticket
					if (operation === 'delete') {
						const ticketId = this.getNodeParameter('ticketId', i) as string;
						const endpoint = `/crm/v3/objects/tickets/${ticketId}`;
						await hubspotApiRequest.call(this, 'DELETE', endpoint);
						responseData = { id: ticketId, deleted: true };
					}
					// Batch create tickets
					if (operation === 'batchCreate') {
						const tickets = this.getNodeParameter('tickets', i) as IDataObject;
						const ticketValues = (tickets.ticketValues as IDataObject[]) || [];
						const inputs = ticketValues.map((ticket) => {
							const props: Record<string, unknown> = { ...ticket };
							delete props.id;
							clean(props);
							return { properties: props };
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/tickets/batch/create';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					// Batch update tickets
					if (operation === 'batchUpdate') {
						const tickets = this.getNodeParameter('tickets', i) as IDataObject;
						const ticketValues = (tickets.ticketValues as IDataObject[]) || [];
						const inputs = ticketValues.map((ticket) => {
							const props = (ticket.properties as IDataObject) || {};
							clean(props);
							return {
								id: ticket.id,
								properties: props,
							};
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/tickets/batch/update';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					// Batch read tickets
					if (operation === 'batchRead') {
						const ticketIds = (this.getNodeParameter('ticketIds', i) as string).split(',');
						const properties = this.getNodeParameter('properties', i) as string[];
						const body: IDataObject = {
							inputs: ticketIds.map((id) => ({ id })),
						};
						if (properties.length > 0) {
							qs.properties = properties.join(',');
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/tickets/batch/read';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body, qs);
						responseData = responseData.results || [];
					}
					// Batch delete tickets
					if (operation === 'batchDelete') {
						const ticketIds = (this.getNodeParameter('ticketIds', i) as string).split(',');
						const body = { inputs: ticketIds.map((id) => ({ id })) };
						const endpoint = '/crm/v3/objects/tickets/batch/archive';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = { deleted: ticketIds };
					}
				}

				/* -------------------------------------------------------------------------- */
				/*                                 PRODUCT                                    */
				/* -------------------------------------------------------------------------- */
				if (resource === 'product') {
					// Create product
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const properties: Record<string, unknown> = {
							name,
							...additionalFields,
						};
						clean(properties);
						const body = { properties };
						const endpoint = '/crm/v3/objects/products';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
					}
					// Get product
					if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;
						const properties = this.getNodeParameter('properties', i) as string[];
						const propertiesWithHistory = this.getNodeParameter(
							'propertiesWithHistory',
							i,
						) as string[];
						const associations = this.getNodeParameter('associations', i) as string[];
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						qs.propertiesWithHistory =
							propertiesWithHistory.length > 0 ? propertiesWithHistory.join(',') : undefined;
						qs.associations = associations.length > 0 ? associations.join(',') : undefined;
						clean(qs);
						const endpoint = `/crm/v3/objects/products/${productId}`;
						responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
					}
					// Get all products
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						if (filters.createdAfter) {
							qs.createdAfter = new Date(filters.createdAfter as string).getTime();
						}
						if (filters.createdBefore) {
							qs.createdBefore = new Date(filters.createdBefore as string).getTime();
						}
						if (filters.updatedAfter) {
							qs.updatedAfter = new Date(filters.updatedAfter as string).getTime();
						}
						if (filters.updatedBefore) {
							qs.updatedBefore = new Date(filters.updatedBefore as string).getTime();
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/products';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'GET',
								endpoint,
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', 0);
							responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = responseData.results || [];
						}
					}
					// Search products
					if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filterGroupsUi = this.getNodeParameter('filterGroupsUi', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const sortBy = additionalFields?.sortBy as string;
						const direction = additionalFields?.direction as string;

						const body: IDataObject = {
							properties: properties.length > 0 ? properties : ['name', 'price'],
						};

						if (query) {
							body.query = query;
						}

						const filterGroups = buildFilterGroups(filterGroupsUi);
						if (filterGroups) {
							body.filterGroups = filterGroups;
						}

						const sorts = buildSorts(sortBy, direction);
						if (sorts) {
							body.sorts = sorts;
						}

						const endpoint = '/crm/v3/objects/products/search';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'POST',
								endpoint,
								body,
							);
						} else {
							body.limit = this.getNodeParameter('limit', i);
							responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
							responseData = responseData.results || [];
						}
					}
					// Update product
					if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						clean(additionalFields);
						const body = { properties: additionalFields };
						const endpoint = `/crm/v3/objects/products/${productId}`;
						responseData = await hubspotApiRequest.call(this, 'PATCH', endpoint, body);
					}
					// Delete product
					if (operation === 'delete') {
						const productId = this.getNodeParameter('productId', i) as string;
						const endpoint = `/crm/v3/objects/products/${productId}`;
						await hubspotApiRequest.call(this, 'DELETE', endpoint);
						responseData = { id: productId, deleted: true };
					}
					// Batch create products
					if (operation === 'batchCreate') {
						const products = this.getNodeParameter('products', i) as IDataObject;
						const productValues = (products.productValues as IDataObject[]) || [];
						const inputs = productValues.map((product) => {
							const props: Record<string, unknown> = { ...product };
							delete props.id;
							clean(props);
							return { properties: props };
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/products/batch/create';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					// Batch update products
					if (operation === 'batchUpdate') {
						const products = this.getNodeParameter('products', i) as IDataObject;
						const productValues = (products.productValues as IDataObject[]) || [];
						const inputs = productValues.map((product) => {
							const props = (product.properties as IDataObject) || {};
							clean(props);
							return {
								id: product.id,
								properties: props,
							};
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/products/batch/update';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					// Batch read products
					if (operation === 'batchRead') {
						const productIds = (this.getNodeParameter('productIds', i) as string).split(',');
						const properties = this.getNodeParameter('properties', i) as string[];
						const body: IDataObject = {
							inputs: productIds.map((id) => ({ id })),
						};
						if (properties.length > 0) {
							qs.properties = properties.join(',');
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/products/batch/read';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body, qs);
						responseData = responseData.results || [];
					}
					// Batch delete products
					if (operation === 'batchDelete') {
						const productIds = (this.getNodeParameter('productIds', i) as string).split(',');
						const body = { inputs: productIds.map((id) => ({ id })) };
						const endpoint = '/crm/v3/objects/products/batch/archive';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = { deleted: productIds };
					}
				}

				/* -------------------------------------------------------------------------- */
				/*                                 LINE ITEM                                  */
				/* -------------------------------------------------------------------------- */
				if (resource === 'lineItem') {
					// Create line item
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const properties: Record<string, unknown> = {
							name,
							...additionalFields,
						};
						clean(properties);
						const body = { properties };
						const endpoint = '/crm/v3/objects/line_items';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
					}
					// Get line item
					if (operation === 'get') {
						const lineItemId = this.getNodeParameter('lineItemId', i) as string;
						const properties = this.getNodeParameter('properties', i) as string[];
						const propertiesWithHistory = this.getNodeParameter(
							'propertiesWithHistory',
							i,
						) as string[];
						const associations = this.getNodeParameter('associations', i) as string[];
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						qs.propertiesWithHistory =
							propertiesWithHistory.length > 0 ? propertiesWithHistory.join(',') : undefined;
						qs.associations = associations.length > 0 ? associations.join(',') : undefined;
						clean(qs);
						const endpoint = `/crm/v3/objects/line_items/${lineItemId}`;
						responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
					}
					// Get all line items
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						qs.properties = properties.length > 0 ? properties.join(',') : undefined;
						if (filters.createdAfter) {
							qs.createdAfter = new Date(filters.createdAfter as string).getTime();
						}
						if (filters.createdBefore) {
							qs.createdBefore = new Date(filters.createdBefore as string).getTime();
						}
						if (filters.updatedAfter) {
							qs.updatedAfter = new Date(filters.updatedAfter as string).getTime();
						}
						if (filters.updatedBefore) {
							qs.updatedBefore = new Date(filters.updatedBefore as string).getTime();
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/line_items';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'GET',
								endpoint,
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', 0);
							responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = responseData.results || [];
						}
					}
					// Search line items
					if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						const returnAll = this.getNodeParameter('returnAll', 0);
						const properties = this.getNodeParameter('properties', i) as string[];
						const filterGroupsUi = this.getNodeParameter('filterGroupsUi', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const sortBy = additionalFields?.sortBy as string;
						const direction = additionalFields?.direction as string;

						const body: IDataObject = {
							properties: properties.length > 0 ? properties : ['name', 'price'],
						};

						if (query) {
							body.query = query;
						}

						const filterGroups = buildFilterGroups(filterGroupsUi);
						if (filterGroups) {
							body.filterGroups = filterGroups;
						}

						const sorts = buildSorts(sortBy, direction);
						if (sorts) {
							body.sorts = sorts;
						}

						const endpoint = '/crm/v3/objects/line_items/search';
						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'POST',
								endpoint,
								body,
							);
						} else {
							body.limit = this.getNodeParameter('limit', i);
							responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
							responseData = responseData.results || [];
						}
					}
					// Update line item
					if (operation === 'update') {
						const lineItemId = this.getNodeParameter('lineItemId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						clean(additionalFields);
						const body = { properties: additionalFields };
						const endpoint = `/crm/v3/objects/line_items/${lineItemId}`;
						responseData = await hubspotApiRequest.call(this, 'PATCH', endpoint, body);
					}
					// Delete line item
					if (operation === 'delete') {
						const lineItemId = this.getNodeParameter('lineItemId', i) as string;
						const endpoint = `/crm/v3/objects/line_items/${lineItemId}`;
						await hubspotApiRequest.call(this, 'DELETE', endpoint);
						responseData = { id: lineItemId, deleted: true };
					}
					// Batch create line items
					if (operation === 'batchCreate') {
						const lineItems = this.getNodeParameter('lineItems', i) as IDataObject;
						const lineItemValues = (lineItems.lineItemValues as IDataObject[]) || [];
						const inputs = lineItemValues.map((lineItem) => {
							const props: Record<string, unknown> = { ...lineItem };
							delete props.id;
							clean(props);
							return { properties: props };
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/line_items/batch/create';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					// Batch update line items
					if (operation === 'batchUpdate') {
						const lineItems = this.getNodeParameter('lineItems', i) as IDataObject;
						const lineItemValues = (lineItems.lineItemValues as IDataObject[]) || [];
						const inputs = lineItemValues.map((lineItem) => {
							const props = (lineItem.properties as IDataObject) || {};
							clean(props);
							return {
								id: lineItem.id,
								properties: props,
							};
						});
						const body = { inputs };
						const endpoint = '/crm/v3/objects/line_items/batch/update';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}
					// Batch read line items
					if (operation === 'batchRead') {
						const lineItemIds = (this.getNodeParameter('lineItemIds', i) as string).split(',');
						const properties = this.getNodeParameter('properties', i) as string[];
						const body: IDataObject = {
							inputs: lineItemIds.map((id) => ({ id })),
						};
						if (properties.length > 0) {
							qs.properties = properties.join(',');
						}
						clean(qs);
						const endpoint = '/crm/v3/objects/line_items/batch/read';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body, qs);
						responseData = responseData.results || [];
					}
					// Batch delete line items
					if (operation === 'batchDelete') {
						const lineItemIds = (this.getNodeParameter('lineItemIds', i) as string).split(',');
						const body = { inputs: lineItemIds.map((id) => ({ id })) };
						const endpoint = '/crm/v3/objects/line_items/batch/archive';
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = { deleted: lineItemIds };
					}
				}

				/* -------------------------------------------------------------------------- */
				/*                                 ASSOCIATION                               */
				/* -------------------------------------------------------------------------- */
				if (resource === 'association') {
					const fromObjectType = this.getNodeParameter('fromObjectType', i) as string;
					const toObjectType = this.getNodeParameter('toObjectType', i) as string;

					// Create association (v4 API)
					if (operation === 'create') {
						const fromObjectId = this.getNodeParameter('fromObjectId', i) as string;
						const toObjectId = this.getNodeParameter('toObjectId', i) as string;
						const associationLabels = this.getNodeParameter('associationLabels', i) as IDataObject;
						const labelValues = (associationLabels.labelValues as IDataObject[]) || [];

						// v4 API uses PUT with labels array
						const labels = labelValues.map((label) => ({
							associationCategory: label.associationCategory || 'HUBSPOT_DEFINED',
							associationTypeId: label.associationTypeId || 0,
						}));

						// If no labels provided, use default
						if (labels.length === 0) {
							labels.push({
								associationCategory: 'HUBSPOT_DEFINED',
								associationTypeId: 0,
							});
						}

						const endpoint = `/crm/v4/objects/${fromObjectType}/${fromObjectId}/associations/${toObjectType}/${toObjectId}`;
						responseData = await hubspotApiRequest.call(this, 'PUT', endpoint, labels);
						responseData = { success: true, fromObjectId, toObjectId };
					}

					// Delete association (v4 API)
					if (operation === 'delete') {
						const fromObjectId = this.getNodeParameter('fromObjectId', i) as string;
						const toObjectId = this.getNodeParameter('toObjectId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const associationTypeIds = additionalFields?.associationTypeIds as string;

						// v4 API uses DELETE with optional associationTypeIds query param
						if (associationTypeIds) {
							qs.associationTypeIds = associationTypeIds.split(',').map((id) => id.trim());
						}
						clean(qs);

						const endpoint = `/crm/v4/objects/${fromObjectType}/${fromObjectId}/associations/${toObjectType}/${toObjectId}`;
						await hubspotApiRequest.call(this, 'DELETE', endpoint, {}, qs);
						responseData = { deleted: true, fromObjectId, toObjectId };
					}

					// Get associations (v4 API)
					if (operation === 'get') {
						const fromObjectId = this.getNodeParameter('fromObjectId', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						const after = this.getNodeParameter('after', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const associationTypeIds = additionalFields?.associationTypeIds as string;

						qs.limit = limit;
						if (after) {
							qs.after = after;
						}
						if (associationTypeIds) {
							qs.associationTypeIds = associationTypeIds.split(',').map((id) => id.trim());
						}
						clean(qs);

						const endpoint = `/crm/v4/objects/${fromObjectType}/${fromObjectId}/associations/${toObjectType}`;
						responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
						responseData = responseData.results || [];
					}

					// Batch create associations (v4 API)
					if (operation === 'batchCreate') {
						const associations = this.getNodeParameter('associations', i) as IDataObject;
						const associationValues = (associations.associationValues as IDataObject[]) || [];

						// v4 API uses batch endpoint with inputs array
						const inputs = associationValues.map((assoc) => {
							const labels = (assoc.associationLabels?.labelValues as IDataObject[]) || [];
							return {
								from: { id: assoc.fromObjectId },
								to: { id: assoc.toObjectId },
								labels:
									labels.length > 0
										? labels.map((label) => ({
												associationCategory: label.associationCategory || 'HUBSPOT_DEFINED',
												associationTypeId: label.associationTypeId || 0,
											}))
										: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 0 }],
							};
						});

						const body = { inputs };
						const endpoint = `/crm/v4/associations/${fromObjectType}/${toObjectType}/batch/create`;
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = responseData.results || [];
					}

					// Batch delete associations (v4 API)
					if (operation === 'batchDelete') {
						const associations = this.getNodeParameter('associations', i) as IDataObject;
						const associationValues = (associations.associationValues as IDataObject[]) || [];

						const inputs = associationValues.map((assoc) => ({
							from: { id: assoc.fromObjectId },
							to: { id: assoc.toObjectId },
						}));

						const body = { inputs };
						const endpoint = `/crm/v4/associations/${fromObjectType}/${toObjectType}/batch/delete`;
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
						responseData = { deleted: inputs.length };
					}

					// Create association label (v4 API)
					if (operation === 'createLabel') {
						const label = this.getNodeParameter('label', i) as string;
						const name = this.getNodeParameter('name', i) as string;

						const body: IDataObject = {
							label,
						};
						if (name) {
							body.name = name;
						}

						const endpoint = `/crm/v4/associations/${fromObjectType}/${toObjectType}/labels`;
						responseData = await hubspotApiRequest.call(this, 'POST', endpoint, body);
					}

					// Get association labels (v4 API)
					if (operation === 'getLabels') {
						const returnAll = this.getNodeParameter('returnAll', 0);
						const endpoint = `/crm/v4/associations/${fromObjectType}/${toObjectType}/labels`;

						if (returnAll) {
							responseData = await hubspotApiRequestAllItems.call(
								this,
								'results',
								'GET',
								endpoint,
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', i);
							clean(qs);
							responseData = await hubspotApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = responseData.results || [];
						}
					}

					// Update association label (v4 API)
					if (operation === 'updateLabel') {
						const labelId = this.getNodeParameter('labelId', i) as string;
						const label = this.getNodeParameter('label', i) as string;
						const name = this.getNodeParameter('name', i) as string;

						const body: IDataObject = {
							label,
						};
						if (name) {
							body.name = name;
						}

						const endpoint = `/crm/v4/associations/${fromObjectType}/${toObjectType}/labels/${labelId}`;
						responseData = await hubspotApiRequest.call(this, 'PATCH', endpoint, body);
					}

					// Delete association label (v4 API)
					if (operation === 'deleteLabel') {
						const labelId = this.getNodeParameter('labelId', i) as string;
						const endpoint = `/crm/v4/associations/${fromObjectType}/${toObjectType}/labels/${labelId}`;
						await hubspotApiRequest.call(this, 'DELETE', endpoint);
						responseData = { deleted: true, labelId };
					}
				}

				// Ensure responseData is defined
				if (responseData === undefined) {
					throw new Error('No response data returned from operation');
				}

				const itemData = generatePairedItemData(items.length);
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as JsonObject).message } });
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
