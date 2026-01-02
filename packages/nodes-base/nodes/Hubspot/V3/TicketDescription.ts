import type { INodeProperties } from 'n8n-workflow';

export const ticketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a ticket',
				action: 'Create a ticket',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a ticket',
				action: 'Delete a ticket',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a ticket',
				action: 'Get a ticket',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tickets',
				action: 'Get many tickets',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search tickets using CRM v3 search API',
				action: 'Search tickets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a ticket',
				action: 'Update a ticket',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple tickets in a single request',
				action: 'Batch create tickets',
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: 'Update multiple tickets in a single request',
				action: 'Batch update tickets',
			},
			{
				name: 'Batch Read',
				value: 'batchRead',
				description: 'Read multiple tickets by ID',
				action: 'Batch read tickets',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple tickets in a single request',
				action: 'Batch delete tickets',
			},
		],
		default: 'create',
	},
];

export const ticketFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                ticket:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Ticket Name',
		name: 'hs_ticket_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the ticket',
	},
	{
		displayName: 'Ticket Properties',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Property',
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
			},
			{
				displayName: 'Priority',
				name: 'hs_ticket_priority',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTicketPriorities',
				},
				default: '',
			},
			{
				displayName: 'Pipeline Name or ID',
				name: 'hs_pipeline',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTicketPipelines',
				},
				default: '',
			},
			{
				displayName: 'Stage Name or ID',
				name: 'hs_pipeline_stage',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTicketStages',
				},
				default: '',
			},
			{
				displayName: 'Source Type',
				name: 'source_type',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTicketSources',
				},
				default: '',
			},
			{
				displayName: 'Ticket Owner Name or ID',
				name: 'hubspot_owner_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOwners',
				},
				default: '',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                ticket:get                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the ticket',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTicketProperties',
		},
		displayOptions: {
			show: {
				resource: ['ticket'],
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
			loadOptionsMethod: 'getTicketProperties',
		},
		displayOptions: {
			show: {
				resource: ['ticket'],
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
				name: 'Deals',
				value: 'deals',
			},
		],
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['get'],
			},
		},
		default: [],
		description: 'The associations to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                ticket:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['ticket'],
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
				resource: ['ticket'],
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
	/* -------------------------------------------------------------------------- */
	/*                                ticket:search                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['ticket'],
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
				resource: ['ticket'],
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
				resource: ['ticket'],
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
			loadOptionsMethod: 'getTicketProperties',
		},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['search'],
			},
		},
		default: ['hs_ticket_name', 'hs_ticket_priority'],
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
				resource: ['ticket'],
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
				resource: ['ticket'],
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
	/*                                ticket:update                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the ticket to update',
	},
	/* -------------------------------------------------------------------------- */
	/*                                ticket:batchCreate                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Tickets',
		name: 'tickets',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Ticket',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['batchCreate'],
			},
		},
		options: [
			{
				name: 'ticketValues',
				displayName: 'Ticket',
				values: [
					{
						displayName: 'Ticket Name',
						name: 'hs_ticket_name',
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
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: {
									alwaysOpenEditWindow: true,
								},
								default: '',
							},
							{
								displayName: 'Priority',
								name: 'hs_ticket_priority',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getTicketPriorities',
								},
								default: '',
							},
						],
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                ticket:batchUpdate                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Tickets',
		name: 'tickets',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Ticket',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['batchUpdate'],
			},
		},
		options: [
			{
				name: 'ticketValues',
				displayName: 'Ticket',
				values: [
					{
						displayName: 'Ticket ID',
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
								displayName: 'Ticket Name',
								name: 'hs_ticket_name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Priority',
								name: 'hs_ticket_priority',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getTicketPriorities',
								},
								default: '',
							},
						],
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                ticket:batchRead                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Ticket IDs',
		name: 'ticketIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['batchRead'],
			},
		},
		default: '',
		description: 'Comma-separated list of ticket IDs',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTicketProperties',
		},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['batchRead'],
			},
		},
		default: [],
		description: 'The properties to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                ticket:batchDelete                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Ticket IDs',
		name: 'ticketIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['batchDelete'],
			},
		},
		default: '',
		description: 'Comma-separated list of ticket IDs to delete',
	},
];
