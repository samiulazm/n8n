import type { INodeProperties } from 'n8n-workflow';

export const lineItemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lineItem'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a line item',
				action: 'Create a line item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a line item',
				action: 'Delete a line item',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a line item',
				action: 'Get a line item',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many line items',
				action: 'Get many line items',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search line items using CRM v3 search API',
				action: 'Search line items',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a line item',
				action: 'Update a line item',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple line items in a single request',
				action: 'Batch create line items',
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: 'Update multiple line items in a single request',
				action: 'Batch update line items',
			},
			{
				name: 'Batch Read',
				value: 'batchRead',
				description: 'Read multiple line items by ID',
				action: 'Batch read line items',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple line items in a single request',
				action: 'Batch delete line items',
			},
		],
		default: 'create',
	},
];

export const lineItemFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                lineItem:create                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Line Item Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the line item',
	},
	{
		displayName: 'Line Item Properties',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Property',
		default: {},
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                lineItem:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the line item',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getLineItemProperties',
		},
		displayOptions: {
			show: {
				resource: ['lineItem'],
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
			loadOptionsMethod: 'getLineItemProperties',
		},
		displayOptions: {
			show: {
				resource: ['lineItem'],
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
				name: 'Deals',
				value: 'deals',
			},
			{
				name: 'Products',
				value: 'products',
			},
		],
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['get'],
			},
		},
		default: [],
		description: 'The associations to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                lineItem:getAll                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['lineItem'],
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
				resource: ['lineItem'],
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
				resource: ['lineItem'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAfter',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Updated Before',
				name: 'updatedBefore',
				type: 'dateTime',
				default: '',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                lineItem:search                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lineItem'],
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
				resource: ['lineItem'],
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
				resource: ['lineItem'],
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
			loadOptionsMethod: 'getLineItemProperties',
		},
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['search'],
			},
		},
		default: ['name', 'price'],
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
				resource: ['lineItem'],
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
				resource: ['lineItem'],
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
	/*                                lineItem:update                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the line item to update',
	},
	/* -------------------------------------------------------------------------- */
	/*                                lineItem:batchCreate                        */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Line Items',
		name: 'lineItems',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Line Item',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['batchCreate'],
			},
		},
		options: [
			{
				name: 'lineItemValues',
				displayName: 'Line Item',
				values: [
					{
						displayName: 'Line Item Name',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Price',
						name: 'price',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                lineItem:batchUpdate                        */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Line Items',
		name: 'lineItems',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Line Item',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['batchUpdate'],
			},
		},
		options: [
			{
				name: 'lineItemValues',
				displayName: 'Line Item',
				values: [
					{
						displayName: 'Line Item ID',
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
								displayName: 'Line Item Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Price',
								name: 'price',
								type: 'number',
								default: 0,
							},
							{
								displayName: 'Quantity',
								name: 'quantity',
								type: 'number',
								default: 1,
							},
						],
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                lineItem:batchRead                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Line Item IDs',
		name: 'lineItemIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['batchRead'],
			},
		},
		default: '',
		description: 'Comma-separated list of line item IDs',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getLineItemProperties',
		},
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['batchRead'],
			},
		},
		default: [],
		description: 'The properties to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                                lineItem:batchDelete                        */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Line Item IDs',
		name: 'lineItemIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['batchDelete'],
			},
		},
		default: '',
		description: 'Comma-separated list of line item IDs to delete',
	},
];
