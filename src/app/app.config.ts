import { OpaqueToken } from "@angular/core";

export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
	DEV_SERVER: string;
	PROD_SERVER: string;
	// IS_DEV: boolean;

	HIERARCHY_SERVICE: string;
	HIERARCHY_URI: string;

	HIERARCHY_ROOT_ID: string;


	// SEARCH_QUERY: string;
	// SEARCH_MATCH_TYPE: string;
	// SEARCH_FIRST_MATCH: string;
	// SEARCH_INTERNAL_ONLY: string;
	// SEARCH_TERMINOLOGIES: string;

	// MATCH_TYPE_EXACT: string;
	// MATCH_TYPE_INCLUDED: string;

	// DEFAULT_SEARCH_MATCH_TYPE: boolean;
	// DEFAULT_SEARCH_FIRST_MATCH: boolean;
	// DEFAULT_SEARCH_INTERNAL_ONLY: boolean;

	ERROR_MESSAGE_URL: string;
}

export const AppConfig: IAppConfig = {    
	DEV_SERVER: 'https://dev-gfbio.bgbm.org/api/terminologies/',
	PROD_SERVER: 'https://terminologies.gfbio.org/api/terminologies/',
	// IS_DEV: false,

	HIERARCHY_SERVICE: 'hierarchy',
	HIERARCHY_URI: 'uri',

	HIERARCHY_ROOT_ID: 'HIERARCHY_ROOT_ID',

	// SEARCH_QUERY: 'query',
	// SEARCH_MATCH_TYPE: 'match_type',
	// SEARCH_FIRST_MATCH: 'first_hit',
	// SEARCH_INTERNAL_ONLY: 'internal_only',
	// SEARCH_TERMINOLOGIES: 'terminologies',

	// MATCH_TYPE_EXACT: 'exact',
	// MATCH_TYPE_INCLUDED: 'included',

	// DEFAULT_SEARCH_MATCH_TYPE: true,
	// DEFAULT_SEARCH_FIRST_MATCH: false,
	// DEFAULT_SEARCH_INTERNAL_ONLY: true,

	ERROR_MESSAGE_URL: 'https://terminologies.gfbio.org/about/#team',
};