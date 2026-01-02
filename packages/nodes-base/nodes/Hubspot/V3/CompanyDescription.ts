import type { INodeProperties } from 'n8n-workflow';

export const companyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['company'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a company',
				action: 'Create a company',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a company',
				action: 'Delete a company',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a company',
				action: 'Get a company',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many companies',
				action: 'Get many companies',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search companies using CRM v3 search API',
				action: 'Search companies',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a company',
				action: 'Update a company',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple companies in a single request',
				action: 'Batch create companies',
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: 'Update multiple companies in a single request',
				action: 'Batch update companies',
			},
			{
				name: 'Batch Read',
				value: 'batchRead',
				description: 'Read multiple companies by ID',
				action: 'Batch read companies',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple companies in a single request',
				action: 'Batch delete companies',
			},
		],
		default: 'create',
	},
];

export const companyFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                company:create                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the company',
	},
	{
		displayName: 'Company Properties',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Property',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'About Us',
				name: 'aboutUs',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
			},
			{
				displayName: 'Annual Revenue',
				name: 'annualRevenue',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'The actual or estimated annual revenue of the company',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'The city where the company is located',
			},
			{
				displayName: 'Company Domain Name',
				name: 'domain',
				type: 'string',
				default: '',
				description: 'The domain name of the company or organization',
			},
			{
				displayName: 'Company Owner Name or ID',
				name: 'hubspot_owner_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOwners',
				},
				default: '',
				description:
					'The owner of the company. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Country/Region',
				name: 'country',
				type: 'string',
				default: '',
				description: 'The country/region in which the company or organization is located',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: "A short statement about the company's mission and goals",
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The type of business the company performs',
			},
			{
				displayName: 'Lifecycle Stage',
				name: 'lifecyclestage',
				type: 'options',
				options: [
					{
						name: 'Subscriber',
						value: 'subscriber',
					},
					{
						name: 'Lead',
						value: 'lead',
					},
					{
						name: 'Marketing Qualified Lead',
						value: 'marketingqualifiedlead',
					},
					{
						name: 'Sales Qualified Lead',
						value: 'salesqualifiedlead',
					},
					{
						name: 'Opportunity',
						value: 'opportunity',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Evangelist',
						value: 'evangelist',
					},
					{
						name: 'Other',
						value: 'other',
					},
				],
				default: '',
			},
			{
				displayName: 'Number of Employees',
				name: 'numberofemployees',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Postal Code',
				name: 'zip',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State/Region',
				name: 'state',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Street Address',
				name: 'address',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Website URL',
				name: 'website',
				type: 'string',
				default: '',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                company:get                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the company',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getCompanyProperties',
		},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get', 'getAll'],
			},
		},
		default: [],
		description: 'The properties to return',
	},
	{
		displayName: 'Properties With History',
		name: 'propertiesWithHistory',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getCompanyProperties',
		},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get'],
			},
		},
		default: [],
		description: 'The properties to return with their history',
	},
	{
		displayName: 'Associations',
		name: 'associations',
		type: 'multiOptions',
		options: [
			{
				name: 'Contacts',
				value: 'contacts',
			},
			{
				name: 'Deals',
				value: 'deals',
			},
			{
				name: 'Tickets',
				value: 'tickets',
			},
		],
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get'],
			},
		},
		default: [],
		description: 'The associations to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                company:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Return only companies created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Return only companies created before this date',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAfter',
				type: 'dateTime',
				default: '',
				description: 'Return only companies updated after this date',
			},
			{
				displayName: 'Updated Before',
				name: 'updatedBefore',
				type: 'dateTime',
				default: '',
				description: 'Return only companies updated before this date',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                company:search                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['search'],
			},
		},
		default: '',
		description:
			'Perform a text search against all property values. Leave empty to use filterGroups instead. See <a href="https://developers.hubspot.com/docs/api/crm/search">HubSpot Search API docs</a>',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['search'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['search'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 10,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getCompanyProperties',
		},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['search'],
			},
		},
		default: ['name', 'domain'],
		description: 'The properties to return',
	},
	{
		displayName: 'Filter Groups',
		name: 'filterGroupsUi',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Filter Group',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['search'],
			},
		},
		options: [
			{
				name: 'filterGroupsValues',
				displayName: 'Filter Group',
				values: [
					{
						displayName: 'Filters',
						name: 'filtersUi',
						type: 'fixedCollection',
						default: {},
						placeholder: 'Add Filter',
						typeOptions: {
							multipleValues: true,
						},
						options: [
							{
								name: 'filterValues',
								displayName: 'Filter',
								values: [
									{
										displayName: 'Property Name',
										name: 'propertyName',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Operator',
										name: 'operator',
										type: 'options',
										options: [
											{ name: 'Contains Exactly', value: 'CONTAINS_TOKEN' },
											{ name: 'Equal', value: 'EQ' },
											{ name: 'Greater Than', value: 'GT' },
											{ name: 'Greater Than Or Equal', value: 'GTE' },
											{ name: 'Is Known', value: 'HAS_PROPERTY' },
											{ name: 'Is Unknown', value: 'NOT_HAS_PROPERTY' },
											{ name: 'Less Than', value: 'LT' },
											{ name: 'Less Than Or Equal', value: 'LTE' },
											{ name: 'Not Equal', value: 'NEQ' },
										],
										default: 'EQ',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										displayOptions: {
											hide: {
												operator: ['HAS_PROPERTY', 'NOT_HAS_PROPERTY'],
											},
										},
										default: '',
									},
								],
							},
						],
						description:
							'Filters within a group use AND, groups use OR. Max 3 groups with 3 filters each.',
					},
				],
			},
		],
		description:
			'When multiple filters are in a Filter Group, they use AND. Multiple Filter Groups use OR. Max 3 Filter Groups.',
	},
	{
		displayName: 'Options',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'string',
				default: 'createdate',
			},
			{
				displayName: 'Sort Order',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'ASCENDING' },
					{ name: 'Descending', value: 'DESCENDING' },
				],
				default: 'DESCENDING',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                company:update                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the company to update',
	},
	/* -------------------------------------------------------------------------- */
	/*                                company:batchCreate                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Companies',
		name: 'companies',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Company',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['batchCreate'],
			},
		},
		options: [
			{
				name: 'companyValues',
				displayName: 'Company',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Additional Properties',
						name: 'additionalFields',
						type: 'collection',
						placeholder: 'Add Property',
						default: {},
						options: [
							{
								displayName: 'Domain',
								name: 'domain',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Website',
								name: 'website',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Phone',
								name: 'phone',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'State',
								name: 'state',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                company:batchUpdate                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Companies',
		name: 'companies',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Company',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['batchUpdate'],
			},
		},
		options: [
			{
				name: 'companyValues',
				displayName: 'Company',
				values: [
					{
						displayName: 'Company ID',
						name: 'id',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Properties',
						name: 'properties',
						type: 'collection',
						placeholder: 'Add Property',
						default: {},
						options: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Domain',
								name: 'domain',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Website',
								name: 'website',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                company:batchRead                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company IDs',
		name: 'companyIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['batchRead'],
			},
		},
		default: '',
		description: 'Comma-separated list of company IDs',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getCompanyProperties',
		},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['batchRead'],
			},
		},
		default: ['name', 'domain', 'website'],
		description: 'The properties to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                company:batchDelete                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company IDs',
		name: 'companyIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['batchDelete'],
			},
		},
		default: '',
		description: 'Comma-separated list of company IDs to delete',
	},
];
