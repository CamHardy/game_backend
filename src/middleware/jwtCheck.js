import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

export const jwtCheckUser = auth({
	audience: 'https://www.cantocrate.ddns.net/game_api',
    issuerBaseURL: `https://dev-iz7tlbfybwzzy8rg.us.auth0.com/`,
});

export const checkAdminScope = requiredScopes('create:quest', 'create:dungeon');