import type { INodeProperties } from 'n8n-workflow';

export const dealOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deal'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a deal',
				action: 'Create a deal',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a deal',
				action: 'Delete a deal',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a deal',
				action: 'Get a deal',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many deals',
				action: 'Get many deals',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search deals using CRM v3 search API',
				action: 'Search deals',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a deal',
				action: 'Update a deal',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple deals in a single request',
				action: 'Batch create deals',
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: 'Update multiple deals in a single request',
				action: 'Batch update deals',
			},
			{
				name: 'Batch Read',
				value: 'batchRead',
				description: 'Read multiple deals by ID',
				action: 'Batch read deals',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple deals in a single request',
				action: 'Batch delete deals',
			},
		],
		default: 'create',
	},
];

export const dealFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                deal:create                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Deal Name',
		name: 'dealname',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the deal',
	},
	{
		displayName: 'Deal Properties',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Property',
		default: {},
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'The monetary value of the deal',
			},
			{
				displayName: 'Deal Stage Name or ID',
				name: 'dealstage',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDealStages',
				},
				default: '',
				description:
					'The deal stage is required when creating a deal. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Pipeline Name or ID',
				name: 'pipeline',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDealPipelines',
				},
				default: '',
				description:
					'The pipeline the deal is in. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Close Date',
				name: 'closedate',
				type: 'dateTime',
				default: '',
				description: 'The date the deal is expected to close',
			},
			{
				displayName: 'Deal Type',
				name: 'dealtype',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
			},
			{
				displayName: 'Deal Owner Name or ID',
				name: 'hubspot_owner_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOwners',
				},
				default: '',
				description:
					'The owner of the deal. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                deal:get                                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the deal',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getDealProperties',
		},
		displayOptions: {
			show: {
				resource: ['deal'],
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
			loadOptionsMethod: 'getDealProperties',
		},
		displayOptions: {
			show: {
				resource: ['deal'],
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
				name: 'Companies',
				value: 'companies',
			},
			{
				name: 'Contacts',
				value: 'contacts',
			},
			{
				name: 'Tickets',
				value: 'tickets',
			},
		],
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['get'],
			},
		},
		default: [],
		description: 'The associations to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                deal:getAll                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['deal'],
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
				resource: ['deal'],
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
				resource: ['deal'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Return only deals created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Return only deals created before this date',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAfter',
				type: 'dateTime',
				default: '',
				description: 'Return only deals updated after this date',
			},
			{
				displayName: 'Updated Before',
				name: 'updatedBefore',
				type: 'dateTime',
				default: '',
				description: 'Return only deals updated before this date',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                deal:search                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['deal'],
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
				resource: ['deal'],
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
				resource: ['deal'],
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
			loadOptionsMethod: 'getDealProperties',
		},
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['search'],
			},
		},
		default: ['dealname', 'amount', 'dealstage'],
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
				resource: ['deal'],
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
				resource: ['deal'],
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
	/*                                deal:update                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the deal to update',
	},
	/* -------------------------------------------------------------------------- */
	/*                                deal:batchCreate                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Deals',
		name: 'deals',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Deal',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['batchCreate'],
			},
		},
		options: [
			{
				name: 'dealValues',
				displayName: 'Deal',
				values: [
					{
						displayName: 'Deal Name',
						name: 'dealname',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'Deal Stage',
						name: 'dealstage',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                deal:batchUpdate                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Deals',
		name: 'deals',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Deal',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['batchUpdate'],
			},
		},
		options: [
			{
				name: 'dealValues',
				displayName: 'Deal',
				values: [
					{
						displayName: 'Deal ID',
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
								displayName: 'Deal Name',
								name: 'dealname',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Amount',
								name: 'amount',
								type: 'number',
								default: 0,
							},
						],
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                deal:batchRead                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Deal IDs',
		name: 'dealIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['batchRead'],
			},
		},
		default: '',
		description: 'Comma-separated list of deal IDs',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getDealProperties',
		},
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['batchRead'],
			},
		},
		default: ['dealname', 'amount', 'dealstage'],
		description: 'The properties to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                deal:batchDelete                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Deal IDs',
		name: 'dealIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['batchDelete'],
			},
		},
		default: '',
		description: 'Comma-separated list of deal IDs to delete',
	},
];
