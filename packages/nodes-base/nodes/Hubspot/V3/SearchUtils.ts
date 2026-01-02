import type { IDataObject, INodeProperties } from 'n8n-workflow';

/**
 * Build filterGroups for HubSpot v3 search API
 */
export function buildFilterGroups(filterGroupsUi: IDataObject): IDataObject[] | undefined {
	if (!filterGroupsUi?.filterGroupsValues) {
		return undefined;
	}

	const filterGroupValues = filterGroupsUi.filterGroupsValues as IDataObject[];
	const filterGroups: IDataObject[] = [];

	for (const filterGroupValue of filterGroupValues) {
		if (filterGroupValue.filtersUi) {
			const filterValues = (filterGroupValue.filtersUi as IDataObject)
				.filterValues as IDataObject[];

			if (filterValues && filterValues.length > 0) {
				const filters = filterValues.map((filter) => {
					const filterCopy = { ...filter };
					// Remove the type field if it exists
					delete filterCopy.type;
					// Extract property name if it contains | separator
					if (filterCopy.propertyName && typeof filterCopy.propertyName === 'string') {
						filterCopy.propertyName = filterCopy.propertyName.split('|')[0];
					}
					return filterCopy;
				});

				filterGroups.push({ filters });
			}
		}
	}

	// HubSpot allows max 3 filter groups
	if (filterGroups.length > 3) {
		throw new Error('You can only have 3 filter groups');
	}

	return filterGroups.length > 0 ? filterGroups : undefined;
}

/**
 * Build sorts array for HubSpot v3 search API
 */
export function buildSorts(sortBy?: string, direction?: string): IDataObject[] | undefined {
	if (!sortBy) {
		return undefined;
	}

	return [
		{
			propertyName: sortBy,
			direction: direction || 'DESCENDING',
		},
	];
}

/**
 * Common search fields for all resources
 */
export const searchFields: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
		default: '',
		description:
			'Perform a text search against all property values. Leave empty to use filterGroups instead.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
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
										displayName: 'Property Name or ID',
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
							'Use filters to limit results. Filters within a group use AND, groups use OR. Max 3 groups with 3 filters each.',
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
];
