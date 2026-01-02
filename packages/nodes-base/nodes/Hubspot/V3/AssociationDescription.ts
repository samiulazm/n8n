import type { INodeProperties } from 'n8n-workflow';

export const associationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['association'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an association between two objects (v4 API)',
				action: 'Create an association',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an association between two objects (v4 API)',
				action: 'Delete an association',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get associations for an object (v4 API)',
				action: 'Get associations',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple associations in a single request (v4 API)',
				action: 'Batch create associations',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple associations in a single request (v4 API)',
				action: 'Batch delete associations',
			},
			{
				name: 'Create Label',
				value: 'createLabel',
				description: 'Create a custom association label (v4 API)',
				action: 'Create association label',
			},
			{
				name: 'Get Labels',
				value: 'getLabels',
				description: 'Get all association labels for object types (v4 API)',
				action: 'Get association labels',
			},
			{
				name: 'Update Label',
				value: 'updateLabel',
				description: 'Update an association label (v4 API)',
				action: 'Update association label',
			},
			{
				name: 'Delete Label',
				value: 'deleteLabel',
				description: 'Delete an association label (v4 API)',
				action: 'Delete association label',
			},
		],
		default: 'create',
	},
];

export const associationFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                association:create                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'From Object Type',
		name: 'fromObjectType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['create', 'delete', 'get', 'batchCreate', 'batchDelete'],
			},
		},
		options: [
			{
				name: 'Company',
				value: 'companies',
			},
			{
				name: 'Contact',
				value: 'contacts',
			},
			{
				name: 'Deal',
				value: 'deals',
			},
			{
				name: 'Ticket',
				value: 'tickets',
			},
			{
				name: 'Product',
				value: 'products',
			},
			{
				name: 'Line Item',
				value: 'line_items',
			},
		],
		default: 'contacts',
		description: 'The source object type',
	},
	{
		displayName: 'To Object Type',
		name: 'toObjectType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['create', 'delete', 'get', 'batchCreate', 'batchDelete'],
			},
		},
		options: [
			{
				name: 'Company',
				value: 'companies',
			},
			{
				name: 'Contact',
				value: 'contacts',
			},
			{
				name: 'Deal',
				value: 'deals',
			},
			{
				name: 'Ticket',
				value: 'tickets',
			},
			{
				name: 'Product',
				value: 'products',
			},
			{
				name: 'Line Item',
				value: 'line_items',
			},
		],
		default: 'companies',
		description: 'The target object type',
	},
	{
		displayName: 'From Object ID',
		name: 'fromObjectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['create', 'delete', 'get'],
			},
		},
		default: '',
		description: 'The ID of the source object',
	},
	{
		displayName: 'To Object ID',
		name: 'toObjectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['create', 'delete', 'batchCreate', 'batchDelete'],
			},
		},
		default: '',
		description: 'The ID of the target object',
	},
	{
		displayName: 'Association Labels',
		name: 'associationLabels',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Association Label',
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['create', 'batchCreate'],
			},
		},
		default: {},
		description:
			'Association labels to apply. Each label should have associationCategory and associationTypeId. For v4 API, labels provide more detailed relationship information.',
		options: [
			{
				name: 'labelValues',
				displayName: 'Label',
				values: [
					{
						displayName: 'Association Category',
						name: 'associationCategory',
						type: 'options',
						options: [
							{
								name: 'HubSpot Defined',
								value: 'HUBSPOT_DEFINED',
							},
							{
								name: 'User Defined',
								value: 'USER_DEFINED',
							},
						],
						default: 'HUBSPOT_DEFINED',
					},
					{
						displayName: 'Association Type ID',
						name: 'associationTypeId',
						type: 'number',
						default: 0,
						description:
							'The association type ID. Common IDs: 1 (contact-to-company), 3 (deal-to-contact), 5 (deal-to-company), 16 (ticket-to-contact), 26 (ticket-to-company). For custom labels, use the label ID.',
					},
				],
			},
		],
	},
	{
		displayName: 'Options',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Association Type IDs',
				name: 'associationTypeIds',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of association type IDs to filter by. Leave empty to get all associations.',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                association:get                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['get'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 10,
		description: 'Max number of associations to return',
	},
	{
		displayName: 'After',
		name: 'after',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'Pagination cursor',
	},
	/* -------------------------------------------------------------------------- */
	/*                                association:batchCreate                     */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Associations',
		name: 'associations',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Association',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['batchCreate'],
			},
		},
		options: [
			{
				name: 'associationValues',
				displayName: 'Association',
				values: [
					{
						displayName: 'From Object ID',
						name: 'fromObjectId',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'To Object ID',
						name: 'toObjectId',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Association Labels',
						name: 'associationLabels',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'Add Label',
						default: {},
						options: [
							{
								name: 'labelValues',
								displayName: 'Label',
								values: [
									{
										displayName: 'Association Category',
										name: 'associationCategory',
										type: 'options',
										options: [
											{ name: 'HubSpot Defined', value: 'HUBSPOT_DEFINED' },
											{ name: 'User Defined', value: 'USER_DEFINED' },
										],
										default: 'HUBSPOT_DEFINED',
									},
									{
										displayName: 'Association Type ID',
										name: 'associationTypeId',
										type: 'number',
										default: 0,
									},
								],
							},
						],
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                association:batchDelete                     */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Associations',
		name: 'associations',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Association',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['batchDelete'],
			},
		},
		options: [
			{
				name: 'associationValues',
				displayName: 'Association',
				values: [
					{
						displayName: 'From Object ID',
						name: 'fromObjectId',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'To Object ID',
						name: 'toObjectId',
						type: 'string',
						required: true,
						default: '',
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                association:createLabel                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'From Object Type',
		name: 'fromObjectType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['createLabel', 'getLabels', 'updateLabel', 'deleteLabel'],
			},
		},
		options: [
			{ name: 'Company', value: 'companies' },
			{ name: 'Contact', value: 'contacts' },
			{ name: 'Deal', value: 'deals' },
			{ name: 'Ticket', value: 'tickets' },
			{ name: 'Product', value: 'products' },
			{ name: 'Line Item', value: 'line_items' },
		],
		default: 'contacts',
		description: 'The source object type',
	},
	{
		displayName: 'To Object Type',
		name: 'toObjectType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['createLabel', 'getLabels', 'updateLabel', 'deleteLabel'],
			},
		},
		options: [
			{ name: 'Company', value: 'companies' },
			{ name: 'Contact', value: 'contacts' },
			{ name: 'Deal', value: 'deals' },
			{ name: 'Ticket', value: 'tickets' },
			{ name: 'Product', value: 'products' },
			{ name: 'Line Item', value: 'line_items' },
		],
		default: 'companies',
		description: 'The target object type',
	},
	{
		displayName: 'Label Name',
		name: 'label',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['createLabel', 'updateLabel'],
			},
		},
		default: '',
		description: 'The display name of the association label (e.g., "Manager", "Decision Maker")',
	},
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['updateLabel', 'deleteLabel'],
			},
		},
		default: '',
		description: 'The ID of the association label to update or delete',
	},
	{
		displayName: 'Internal Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['createLabel', 'updateLabel'],
			},
		},
		default: '',
		description:
			'The internal name (slug) for the label. If not provided, will be generated from the label name.',
	},
	/* -------------------------------------------------------------------------- */
	/*                                association:getLabels                       */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['association'],
				operation: ['getLabels'],
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
				resource: ['association'],
				operation: ['getLabels'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 10,
		description: 'Max number of labels to return',
	},
];
