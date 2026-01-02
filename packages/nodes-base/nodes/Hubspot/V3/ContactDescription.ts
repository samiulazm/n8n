import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new contact',
				action: 'Create a contact',
			},
			{
				name: 'Create or Update',
				value: 'upsert',
				description:
					'Create a new contact, or update the current one if it already exists (upsert)',
				action: 'Create or update a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact',
				action: 'Get a contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search contacts using CRM v3 search API',
				action: 'Search contacts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact',
				action: 'Update a contact',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple contacts in a single request',
				action: 'Batch create contacts',
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: 'Update multiple contacts in a single request',
				action: 'Batch update contacts',
			},
			{
				name: 'Batch Read',
				value: 'batchRead',
				description: 'Read multiple contacts by ID',
				action: 'Batch read contacts',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple contacts in a single request',
				action: 'Batch delete contacts',
			},
		],
		default: 'create',
	},
];

export const contactFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                contact:create/upsert                       */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'upsert'],
			},
		},
		default: '',
		description: 'The email address of the contact',
	},
	{
		displayName: 'Contact Properties',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Property',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update', 'upsert'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstname',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'lastname',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Mobile Phone Number',
				name: 'mobilephone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Job Title',
				name: 'jobtitle',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Company Name',
				name: 'company',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Website URL',
				name: 'website',
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
				displayName: 'State/Region',
				name: 'state',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country/Region',
				name: 'country',
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
				displayName: 'Street Address',
				name: 'address',
				type: 'string',
				default: '',
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
				displayName: 'Contact Owner Name or ID',
				name: 'hubspot_owner_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOwners',
				},
				default: '',
				description:
					'The owner of the contact. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                contact:get                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the contact',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getContactProperties',
		},
		displayOptions: {
			show: {
				resource: ['contact'],
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
			loadOptionsMethod: 'getContactProperties',
		},
		displayOptions: {
			show: {
				resource: ['contact'],
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
				resource: ['contact'],
				operation: ['get'],
			},
		},
		default: [],
		description: 'The associations to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                contact:getAll                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['contact'],
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
				resource: ['contact'],
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
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Return only contacts created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Return only contacts created before this date',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAfter',
				type: 'dateTime',
				default: '',
				description: 'Return only contacts updated after this date',
			},
			{
				displayName: 'Updated Before',
				name: 'updatedBefore',
				type: 'dateTime',
				default: '',
				description: 'Return only contacts updated before this date',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                contact:search                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
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
				resource: ['contact'],
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
				resource: ['contact'],
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
			loadOptionsMethod: 'getContactProperties',
		},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['search'],
			},
		},
		default: ['email', 'firstname', 'lastname'],
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
				resource: ['contact'],
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
										description: 'The property to filter on',
									},
									{
										displayName: 'Operator',
										name: 'operator',
										type: 'options',
										options: [
											{
												name: 'Contains Exactly',
												value: 'CONTAINS_TOKEN',
											},
											{
												name: 'Equal',
												value: 'EQ',
											},
											{
												name: 'Greater Than',
												value: 'GT',
											},
											{
												name: 'Greater Than Or Equal',
												value: 'GTE',
											},
											{
												name: 'Is Known',
												value: 'HAS_PROPERTY',
											},
											{
												name: 'Is Unknown',
												value: 'NOT_HAS_PROPERTY',
											},
											{
												name: 'Less Than',
												value: 'LT',
											},
											{
												name: 'Less Than Or Equal',
												value: 'LTE',
											},
											{
												name: 'Not Equal',
												value: 'NEQ',
											},
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
				resource: ['contact'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'string',
				default: 'createdate',
				description: 'Property to sort by',
			},
			{
				displayName: 'Sort Order',
				name: 'direction',
				type: 'options',
				options: [
					{
						name: 'Ascending',
						value: 'ASCENDING',
					},
					{
						name: 'Descending',
						value: 'DESCENDING',
					},
				],
				default: 'DESCENDING',
				description: 'Sort direction',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                contact:update                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the contact to update',
	},
	/* -------------------------------------------------------------------------- */
	/*                                contact:batchCreate                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contacts',
		name: 'contacts',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Contact',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['batchCreate'],
			},
		},
		options: [
			{
				name: 'contactValues',
				displayName: 'Contact',
				values: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'First Name',
						name: 'firstname',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Last Name',
						name: 'lastname',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                contact:batchUpdate                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contacts',
		name: 'contacts',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Contact',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['batchUpdate'],
			},
		},
		options: [
			{
				name: 'contactValues',
				displayName: 'Contact',
				values: [
					{
						displayName: 'Contact ID',
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
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
							},
							{
								displayName: 'First Name',
								name: 'firstname',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Last Name',
								name: 'lastname',
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
	/*                                contact:batchRead                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact IDs',
		name: 'contactIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['batchRead'],
			},
		},
		default: '',
		description: 'Comma-separated list of contact IDs',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getContactProperties',
		},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['batchRead'],
			},
		},
		default: ['email', 'firstname', 'lastname'],
		description: 'The properties to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                contact:batchDelete                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact IDs',
		name: 'contactIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['batchDelete'],
			},
		},
		default: '',
		description: 'Comma-separated list of contact IDs to delete',
	},
];
