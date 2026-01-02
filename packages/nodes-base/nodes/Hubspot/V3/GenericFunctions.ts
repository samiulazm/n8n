import type {
	ICredentialDataDecryptedObject,
	ICredentialTestFunctions,
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function hubspotApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {
	let authenticationMethod = this.getNodeParameter('authentication', 0);

	if (this.getNode().type.includes('Trigger')) {
		authenticationMethod = 'developerApi';
	}

	const options = {
		method,
		qs: query,
		headers: {},
		uri: uri || `https://api.hubapi.com${endpoint}`,
		body,
		json: true,
		useQuerystring: true,
	} satisfies IRequestOptions;

	try {
		if (authenticationMethod === 'apiKey' || authenticationMethod === 'appToken') {
			const credentialType = authenticationMethod === 'apiKey' ? 'hubspotApi' : 'hubspotAppToken';
			return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
		} else if (authenticationMethod === 'developerApi') {
			if (endpoint.includes('webhooks')) {
				const credentials = await this.getCredentials('hubspotDeveloperApi');
				options.qs.hapikey = credentials.apiKey as string;
				return await this.helpers.request(options);
			} else {
				return await this.helpers.requestOAuth2.call(this, 'hubspotDeveloperApi', options, {
					tokenType: 'Bearer',
					includeCredentialsOnRefreshOnBody: true,
				});
			}
		} else {
			return await this.helpers.requestOAuth2.call(this, 'hubspotOAuth2Api', options, {
				tokenType: 'Bearer',
				includeCredentialsOnRefreshOnBody: true,
			});
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to paginated HubSpot v3 endpoint
 * and return all results
 */
export async function hubspotApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	let after: string | undefined;

	// V3 API uses 'after' for pagination
	do {
		if (after) {
			if (method === 'POST') {
				body.after = after;
			} else {
				query.after = after;
			}
		}

		responseData = await hubspotApiRequest.call(this, method, endpoint, body, query);

		// V3 API pagination structure
		if (responseData.paging?.next?.after) {
			after = responseData.paging.next.after;
		} else {
			after = undefined;
		}

		// Extract results based on property name or default to 'results'
		const items = responseData[propertyName] || responseData.results || [];
		returnData.push.apply(returnData, items as IDataObject[]);

		// Check limit if specified
		const limit = query.limit as number | undefined;
		if (limit && limit <= returnData.length) {
			return returnData.slice(0, limit);
		}
	} while (after);

	return returnData;
}

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = '';
	}
	return result;
}

export function clean(obj: any) {
	for (const propName in obj) {
		if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
			delete obj[propName];
		}
	}
	return obj;
}

/**
 * Convert properties array format to v3 object format
 * V3 API expects properties as a simple object: { propertyName: value }
 */
export function formatPropertiesForV3(
	properties: Array<{ property: string; value: unknown }>,
): Record<string, unknown> {
	const formatted: Record<string, unknown> = {};
	for (const prop of properties) {
		if (prop.property && prop.value !== undefined && prop.value !== null && prop.value !== '') {
			formatted[prop.property] = prop.value;
		}
	}
	return formatted;
}

/**
 * Convert v3 object format to properties array format
 */
export function formatPropertiesFromV3(
	properties: Record<string, unknown>,
): Array<{ property: string; value: unknown }> {
	return Object.entries(properties).map(([property, value]: [string, unknown]) => ({
		property,
		value,
	}));
}

export async function validateCredentials(
	this: ICredentialTestFunctions,
	decryptedCredentials: ICredentialDataDecryptedObject,
): Promise<any> {
	const credentials = decryptedCredentials;

	const { apiKey, appToken } = credentials as {
		appToken: string;
		apiKey: string;
	};

	const options: IRequestOptions = {
		method: 'GET',
		headers: {},
		uri: 'https://api.hubapi.com/crm/v3/objects/contacts',
		qs: { limit: 1 },
		json: true,
	};

	if (apiKey) {
		options.qs = { ...options.qs, hapikey: apiKey };
	} else {
		options.headers = { Authorization: `Bearer ${appToken}` };
	}

	return await this.helpers.request(options);
}
