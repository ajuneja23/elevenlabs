import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'trading-api/2.0.0 (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Endpoint for getting the communications ID of the logged-in user.
   *
   * @summary GetCommunicationsID
   * @throws FetchError<403, types.GetCommunicationsIdResponse403> Generic structure for API error responses.
   * @throws FetchError<500, types.GetCommunicationsIdResponse500> Generic structure for API error responses.
   */
  getCommunicationsID(): Promise<FetchResponse<200, types.GetCommunicationsIdResponse200>> {
    return this.core.fetch('/communications/id', 'get');
  }

  /**
   * Endpoint for getting quotes
   *
   * @summary GetQuotes
   * @throws FetchError<400, types.GetQuotesResponse400> Generic structure for API error responses.
   * @throws FetchError<403, types.GetQuotesResponse403> Generic structure for API error responses.
   * @throws FetchError<500, types.GetQuotesResponse500> Generic structure for API error responses.
   */
  getQuotes(metadata?: types.GetQuotesMetadataParam): Promise<FetchResponse<200, types.GetQuotesResponse200>> {
    return this.core.fetch('/communications/quotes', 'get', metadata);
  }

  /**
   * Endpoint for creating a quote in response to an RFQ
   *
   * @summary CreateQuote
   * @throws FetchError<400, types.CreateQuoteResponse400> Generic structure for API error responses.
   * @throws FetchError<500, types.CreateQuoteResponse500> Generic structure for API error responses.
   */
  createQuote(metadata?: types.CreateQuoteMetadataParam): Promise<FetchResponse<201, types.CreateQuoteResponse201>> {
    return this.core.fetch('/communications/quotes', 'post', metadata);
  }

  /**
   * Endpoint for getting a particular quote
   *
   * @summary GetQuote
   * @throws FetchError<400, types.GetQuoteResponse400> Generic structure for API error responses.
   * @throws FetchError<403, types.GetQuoteResponse403> Generic structure for API error responses.
   * @throws FetchError<404, types.GetQuoteResponse404> Generic structure for API error responses.
   * @throws FetchError<500, types.GetQuoteResponse500> Generic structure for API error responses.
   */
  getQuote(metadata: types.GetQuoteMetadataParam): Promise<FetchResponse<200, types.GetQuoteResponse200>> {
    return this.core.fetch('/communications/quotes/{quote_id}', 'get', metadata);
  }

  /**
   * Endpoint for deleting a quote, which means it can no longer be accepted.
   *
   * @summary DeleteQuote
   * @throws FetchError<400, types.DeleteQuoteResponse400> Generic structure for API error responses.
   * @throws FetchError<403, types.DeleteQuoteResponse403> Generic structure for API error responses.
   * @throws FetchError<404, types.DeleteQuoteResponse404> Generic structure for API error responses.
   * @throws FetchError<500, types.DeleteQuoteResponse500> Generic structure for API error responses.
   */
  deleteQuote(metadata: types.DeleteQuoteMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/communications/quotes/{quote_id}', 'delete', metadata);
  }

  /**
   * Endpoint for accepting a quote. This will require the quoter to confirm
   *
   * @summary AcceptQuote
   * @throws FetchError<400, types.AcceptQuoteResponse400> Generic structure for API error responses.
   * @throws FetchError<403, types.AcceptQuoteResponse403> Generic structure for API error responses.
   * @throws FetchError<404, types.AcceptQuoteResponse404> Generic structure for API error responses.
   * @throws FetchError<500, types.AcceptQuoteResponse500> Generic structure for API error responses.
   */
  acceptQuote(body: types.AcceptQuoteBodyParam, metadata: types.AcceptQuoteMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/communications/quotes/{quote_id}/accept', 'put', body, metadata);
  }

  /**
   * Endpoint for confirming a quote. This will start a timer for order execution
   *
   * @summary ConfirmQuote
   * @throws FetchError<400, types.ConfirmQuoteResponse400> Generic structure for API error responses.
   * @throws FetchError<403, types.ConfirmQuoteResponse403> Generic structure for API error responses.
   * @throws FetchError<404, types.ConfirmQuoteResponse404> Generic structure for API error responses.
   * @throws FetchError<500, types.ConfirmQuoteResponse500> Generic structure for API error responses.
   */
  confirmQuote(metadata: types.ConfirmQuoteMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/communications/quotes/{quote_id}/confirm', 'put', metadata);
  }

  /**
   * Endpoint for getting RFQs
   *
   * @summary GetRFQs
   * @throws FetchError<400, types.GetRfQsResponse400> Generic structure for API error responses.
   * @throws FetchError<403, types.GetRfQsResponse403> Generic structure for API error responses.
   * @throws FetchError<500, types.GetRfQsResponse500> Generic structure for API error responses.
   */
  getRFQs(metadata?: types.GetRfQsMetadataParam): Promise<FetchResponse<200, types.GetRfQsResponse200>> {
    return this.core.fetch('/communications/rfqs', 'get', metadata);
  }

  /**
   * Endpoint for creating a new RFQ
   *
   * @summary CreateRFQ
   * @throws FetchError<400, types.CreateRfqResponse400> Generic structure for API error responses.
   * @throws FetchError<403, types.CreateRfqResponse403> Generic structure for API error responses.
   * @throws FetchError<409, types.CreateRfqResponse409> Generic structure for API error responses.
   * @throws FetchError<500, types.CreateRfqResponse500> Generic structure for API error responses.
   */
  createRFQ(metadata?: types.CreateRfqMetadataParam): Promise<FetchResponse<200, types.CreateRfqResponse200>> {
    return this.core.fetch('/communications/rfqs', 'post', metadata);
  }

  /**
   * Endpoint for getting a single RFQ by id
   *
   * @summary GetRFQ
   * @throws FetchError<400, types.GetRfqResponse400> Generic structure for API error responses.
   * @throws FetchError<404, types.GetRfqResponse404> Generic structure for API error responses.
   * @throws FetchError<500, types.GetRfqResponse500> Generic structure for API error responses.
   */
  getRFQ(metadata: types.GetRfqMetadataParam): Promise<FetchResponse<200, types.GetRfqResponse200>> {
    return this.core.fetch('/communications/rfqs/{rfq_id}', 'get', metadata);
  }

  /**
   * Endpoint for deleting an RFQ by ID
   *
   * @summary DeleteRFQ
   * @throws FetchError<403, types.DeleteRfqResponse403> Generic structure for API error responses.
   * @throws FetchError<404, types.DeleteRfqResponse404> Generic structure for API error responses.
   * @throws FetchError<409, types.DeleteRfqResponse409> Generic structure for API error responses.
   * @throws FetchError<500, types.DeleteRfqResponse500> Generic structure for API error responses.
   */
  deleteRFQ(metadata: types.DeleteRfqMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/communications/rfqs/{rfq_id}', 'delete', metadata);
  }

  /**
   * Endpoint for getting data about all events.
   *
   * @summary GetEvents
   */
  getEvents(metadata?: types.GetEventsMetadataParam): Promise<FetchResponse<200, types.GetEventsResponse200>> {
    return this.core.fetch('/events', 'get', metadata);
  }

  /**
   * Endpoint for getting data about an event by its ticker.
   *
   * @summary GetEvent
   */
  getEvent(metadata: types.GetEventMetadataParam): Promise<FetchResponse<200, types.GetEventResponse200>> {
    return this.core.fetch('/events/{event_ticker}', 'get', metadata);
  }

  /**
   * Endpoint for getting all exchange-wide announcements.
   *
   * @summary GetExchangeAnnouncements
   */
  getExchangeAnnouncements(): Promise<FetchResponse<200, types.GetExchangeAnnouncementsResponse200>> {
    return this.core.fetch('/exchange/announcements', 'get');
  }

  /**
   * Endpoint for getting the exchange schedule.
   *
   * @summary GetExchangeSchedule
   */
  getExchangeSchedule(): Promise<FetchResponse<200, types.GetExchangeScheduleResponse200>> {
    return this.core.fetch('/exchange/schedule', 'get');
  }

  /**
   * Endpoint for getting the exchange status.
   *
   * @summary GetExchangeStatus
   */
  getExchangeStatus(): Promise<FetchResponse<200, types.GetExchangeStatusResponse200>> {
    return this.core.fetch('/exchange/status', 'get');
  }

  /**
   * Endpoint for listing and discovering markets on Kalshi.
   *
   * @summary GetMarkets
   */
  getMarkets(metadata?: types.GetMarketsMetadataParam): Promise<FetchResponse<200, types.GetMarketsResponse200>> {
    return this.core.fetch('/markets', 'get', metadata);
  }

  /**
   * Endpoint for getting all trades for all markets.
   *
   * @summary GetTrades
   */
  getTrades(metadata?: types.GetTradesMetadataParam): Promise<FetchResponse<200, types.GetTradesResponse200>> {
    return this.core.fetch('/markets/trades', 'get', metadata);
  }

  /**
   * Endpoint for getting data about a specific market.
   *
   * The value for the ticker path parameter should match the ticker of the target market.
   *
   * @summary GetMarket
   */
  getMarket(metadata: types.GetMarketMetadataParam): Promise<FetchResponse<200, types.GetMarketResponse200>> {
    return this.core.fetch('/markets/{ticker}', 'get', metadata);
  }

  /**
   * Endpoint for getting the orderbook for a market.
   *
   * @summary GetMarketOrderbook
   */
  getMarketOrderbook(metadata: types.GetMarketOrderbookMetadataParam): Promise<FetchResponse<200, types.GetMarketOrderbookResponse200>> {
    return this.core.fetch('/markets/{ticker}/orderbook', 'get', metadata);
  }

  /**
   * Endpoint for getting data about milestones with optional filtering.
   *
   * @summary GetMilestones
   */
  getMilestones(metadata: types.GetMilestonesMetadataParam): Promise<FetchResponse<200, types.GetMilestonesResponse200>> {
    return this.core.fetch('/milestones/', 'get', metadata);
  }

  /**
   * Endpoint for getting data about a specific milestone by its ID.
   *
   * @summary GetMilestone
   */
  getMilestone(metadata: types.GetMilestoneMetadataParam): Promise<FetchResponse<200, types.GetMilestoneResponse200>> {
    return this.core.fetch('/milestones/{milestone_id}', 'get', metadata);
  }

  /**
   * Endpoint for getting data about multivariate event collections.
   *
   * @summary GetMultivariateEventCollections
   */
  getMultivariateEventCollections(metadata?: types.GetMultivariateEventCollectionsMetadataParam): Promise<FetchResponse<200, types.GetMultivariateEventCollectionsResponse200>> {
    return this.core.fetch('/multivariate_event_collections/', 'get', metadata);
  }

  /**
   * Endpoint for getting data about a multivariate event collection by its ticker.
   *
   * @summary GetMultivariateEventCollection
   */
  getMultivariateEventCollection(metadata: types.GetMultivariateEventCollectionMetadataParam): Promise<FetchResponse<200, types.GetMultivariateEventCollectionResponse200>> {
    return this.core.fetch('/multivariate_event_collections/{collection_ticker}', 'get', metadata);
  }

  /**
   * Endpoint for looking up an individual market in a multivariate event collection.
   * This endpoint must be hit at least once before trading or looking up a market.
   *
   * @summary CreateMarketInMultivariateEventCollection
   */
  createMarketInMultivariateEventCollection(body: types.CreateMarketInMultivariateEventCollectionBodyParam, metadata: types.CreateMarketInMultivariateEventCollectionMetadataParam): Promise<FetchResponse<200, types.CreateMarketInMultivariateEventCollectionResponse200>> {
    return this.core.fetch('/multivariate_event_collections/{collection_ticker}', 'post', body, metadata);
  }

  /**
   * Endpoint for retrieving which markets in an event collection were recently looked up.
   *
   * @summary GetMultivariateEventCollectionLookupHistory
   */
  getMultivariateEventCollectionLookupHistory(metadata: types.GetMultivariateEventCollectionLookupHistoryMetadataParam): Promise<FetchResponse<200, types.GetMultivariateEventCollectionLookupHistoryResponse200>> {
    return this.core.fetch('/multivariate_event_collections/{collection_ticker}/lookup', 'get', metadata);
  }

  /**
   * Endpoint for looking up an individual market in a multivariate event collection.
   *
   * If CreateMarketInMultivariateEventCollection has never been hit with that variable
   * combination before, this
   * will return a 404.
   *
   * @summary LookupTickersForMarketInMultivariateEventCollection
   */
  lookupTickersForMarketInMultivariateEventCollection(body: types.LookupTickersForMarketInMultivariateEventCollectionBodyParam, metadata: types.LookupTickersForMarketInMultivariateEventCollectionMetadataParam): Promise<FetchResponse<200, types.LookupTickersForMarketInMultivariateEventCollectionResponse200>> {
    return this.core.fetch('/multivariate_event_collections/{collection_ticker}/lookup', 'put', body, metadata);
  }

  /**
   * Endpoint for getting the balance of a member.
   *
   * @summary GetBalance
   */
  getBalance(): Promise<FetchResponse<200, types.GetBalanceResponse200>> {
    return this.core.fetch('/portfolio/balance', 'get');
  }

  /**
   * Endpoint for getting all fills for the member.
   *
   * @summary GetFills
   */
  getFills(metadata?: types.GetFillsMetadataParam): Promise<FetchResponse<200, types.GetFillsResponse200>> {
    return this.core.fetch('/portfolio/fills', 'get', metadata);
  }

  /**
   * # Endpoint for getting all orders
   *
   * @summary GetOrders
   */
  getOrders(metadata?: types.GetOrdersMetadataParam): Promise<FetchResponse<200, types.GetOrdersResponse200>> {
    return this.core.fetch('/portfolio/orders', 'get', metadata);
  }

  /**
   * Endpoint for submitting orders in a market.
   *
   * @summary CreateOrder
   */
  createOrder(body: types.CreateOrderBodyParam): Promise<FetchResponse<201, types.CreateOrderResponse201>> {
    return this.core.fetch('/portfolio/orders', 'post', body);
  }

  /**
   * Endpoint for submitting a batch of orders.
   *
   * Each order in the batch is counted against the total rate limit for order operations.
   * Consequently, the size of the batch is capped by the current per-second rate-limit
   * configuration applicable to the user.
   *
   * At the moment of writing, the limit is 20 orders per batch.
   * Available to members with advanced access only.
   *
   * @summary BatchCreateOrders
   */
  batchCreateOrders(body: types.BatchCreateOrdersBodyParam): Promise<FetchResponse<201, types.BatchCreateOrdersResponse201>> {
    return this.core.fetch('/portfolio/orders/batched', 'post', body);
  }

  /**
   * Endpoint for cancelling up to 20 orders at once.
   * Available to members with advanced access only.
   *
   * @summary BatchCancelOrders
   */
  batchCancelOrders(body: types.BatchCancelOrdersBodyParam): Promise<FetchResponse<200, types.BatchCancelOrdersResponse200>> {
    return this.core.fetch('/portfolio/orders/batched', 'delete', body);
  }

  /**
   * Endpoint for getting a single order.
   *
   * @summary GetOrder
   */
  getOrder(metadata: types.GetOrderMetadataParam): Promise<FetchResponse<200, types.GetOrderResponse200>> {
    return this.core.fetch('/portfolio/orders/{order_id}', 'get', metadata);
  }

  /**
   * Endpoint for canceling orders.
   *
   * The value for the orderId should match the id field of the order you want to decrease.
   * Commonly, DELETE-type endpoints return 204 status with no body content on success.
   * But we can't completely delete the order, as it may be partially filled already.
   * Instead, the DeleteOrder endpoint reduce the order completely,
   * essentially zeroing the remaining resting contracts on it.
   * The zeroed order is returned on the response payload as a form of validation for the
   * client.
   *
   * @summary CancelOrder
   */
  cancelOrder(metadata: types.CancelOrderMetadataParam): Promise<FetchResponse<200, types.CancelOrderResponse200>> {
    return this.core.fetch('/portfolio/orders/{order_id}', 'delete', metadata);
  }

  /**
   * Endpoint for amending the max number of fillable contracts and/or price in an existing
   * order.
   *
   * @summary AmendOrder
   */
  amendOrder(body: types.AmendOrderBodyParam, metadata: types.AmendOrderMetadataParam): Promise<FetchResponse<201, types.AmendOrderResponse201>> {
    return this.core.fetch('/portfolio/orders/{order_id}/amend', 'post', body, metadata);
  }

  /**
   * Endpoint for decreasing the number of contracts in an existing order.
   * This is the only kind of edit available on order quantity.
   * Cancelling an order is equivalent to decreasing an order amount to zero.
   *
   * @summary DecreaseOrder
   */
  decreaseOrder(body: types.DecreaseOrderBodyParam, metadata: types.DecreaseOrderMetadataParam): Promise<FetchResponse<201, types.DecreaseOrderResponse201>> {
    return this.core.fetch('/portfolio/orders/{order_id}/decrease', 'post', body, metadata);
  }

  /**
   * Endpoint for getting all market positions for the member.
   *
   * @summary GetPositions
   */
  getPositions(metadata?: types.GetPositionsMetadataParam): Promise<FetchResponse<200, types.GetPositionsResponse200>> {
    return this.core.fetch('/portfolio/positions', 'get', metadata);
  }

  /**
   * Endpoint for getting the member's settlements historical track.
   *
   * @summary GetPortfolioSettlements
   */
  getPortfolioSettlements(metadata?: types.GetPortfolioSettlementsMetadataParam): Promise<FetchResponse<200, types.GetPortfolioSettlementsResponse200>> {
    return this.core.fetch('/portfolio/settlements', 'get', metadata);
  }

  /**
   * Endpoint for getting the total value, in cents, of resting orders.
   * This endpoint is only intended for use by FCM members (rare).
   * Note: If you're uncertain about this endpoint, it likely does not apply to you.
   *
   * @summary GetPortfolioRestingOrderTotalValue
   */
  getPortfolioRestingOrderTotalValue(): Promise<FetchResponse<200, types.GetPortfolioRestingOrderTotalValueResponse200>> {
    return this.core.fetch('/portfolio/summary/total_resting_order_value', 'get');
  }

  /**
   * Endpoint for getting data about a series by its ticker.
   *
   * @summary GetSeries
   */
  getSeries(metadata: types.GetSeriesMetadataParam): Promise<FetchResponse<200, types.GetSeriesResponse200>> {
    return this.core.fetch('/series/{series_ticker}', 'get', metadata);
  }

  /**
   * Endpoint for getting the historical candlesticks for a market.
   *
   * The values for the series_ticker and ticker path parameters should match the
   * series_ticker and ticker of the target market.
   * The start_ts parameter will restrict candlesticks to those ending on or after provided
   * timestamp.
   * The end_ts parameter will restrict candlesticks to those ending on or before provided
   * timestamp.
   * The period_interval parameter determines the time period length of each candlestick.
   *
   * @summary GetMarketCandlesticks
   */
  getMarketCandlesticks(metadata: types.GetMarketCandlesticksMetadataParam): Promise<FetchResponse<200, types.GetMarketCandlesticksResponse200>> {
    return this.core.fetch('/series/{series_ticker}/markets/{ticker}/candlesticks', 'get', metadata);
  }

  /**
   * Endpoint for getting data about a specific structured target by its ID.
   *
   * @summary GetStructuredTarget
   */
  getStructuredTarget(metadata: types.GetStructuredTargetMetadataParam): Promise<FetchResponse<200, types.GetStructuredTargetResponse200>> {
    return this.core.fetch('/structured_targets/{structured_target_id}', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { AcceptQuoteBodyParam, AcceptQuoteMetadataParam, AcceptQuoteResponse400, AcceptQuoteResponse403, AcceptQuoteResponse404, AcceptQuoteResponse500, AmendOrderBodyParam, AmendOrderMetadataParam, AmendOrderResponse201, BatchCancelOrdersBodyParam, BatchCancelOrdersResponse200, BatchCreateOrdersBodyParam, BatchCreateOrdersResponse201, CancelOrderMetadataParam, CancelOrderResponse200, ConfirmQuoteMetadataParam, ConfirmQuoteResponse400, ConfirmQuoteResponse403, ConfirmQuoteResponse404, ConfirmQuoteResponse500, CreateMarketInMultivariateEventCollectionBodyParam, CreateMarketInMultivariateEventCollectionMetadataParam, CreateMarketInMultivariateEventCollectionResponse200, CreateOrderBodyParam, CreateOrderResponse201, CreateQuoteMetadataParam, CreateQuoteResponse201, CreateQuoteResponse400, CreateQuoteResponse500, CreateRfqMetadataParam, CreateRfqResponse200, CreateRfqResponse400, CreateRfqResponse403, CreateRfqResponse409, CreateRfqResponse500, DecreaseOrderBodyParam, DecreaseOrderMetadataParam, DecreaseOrderResponse201, DeleteQuoteMetadataParam, DeleteQuoteResponse400, DeleteQuoteResponse403, DeleteQuoteResponse404, DeleteQuoteResponse500, DeleteRfqMetadataParam, DeleteRfqResponse403, DeleteRfqResponse404, DeleteRfqResponse409, DeleteRfqResponse500, GetBalanceResponse200, GetCommunicationsIdResponse200, GetCommunicationsIdResponse403, GetCommunicationsIdResponse500, GetEventMetadataParam, GetEventResponse200, GetEventsMetadataParam, GetEventsResponse200, GetExchangeAnnouncementsResponse200, GetExchangeScheduleResponse200, GetExchangeStatusResponse200, GetFillsMetadataParam, GetFillsResponse200, GetMarketCandlesticksMetadataParam, GetMarketCandlesticksResponse200, GetMarketMetadataParam, GetMarketOrderbookMetadataParam, GetMarketOrderbookResponse200, GetMarketResponse200, GetMarketsMetadataParam, GetMarketsResponse200, GetMilestoneMetadataParam, GetMilestoneResponse200, GetMilestonesMetadataParam, GetMilestonesResponse200, GetMultivariateEventCollectionLookupHistoryMetadataParam, GetMultivariateEventCollectionLookupHistoryResponse200, GetMultivariateEventCollectionMetadataParam, GetMultivariateEventCollectionResponse200, GetMultivariateEventCollectionsMetadataParam, GetMultivariateEventCollectionsResponse200, GetOrderMetadataParam, GetOrderResponse200, GetOrdersMetadataParam, GetOrdersResponse200, GetPortfolioRestingOrderTotalValueResponse200, GetPortfolioSettlementsMetadataParam, GetPortfolioSettlementsResponse200, GetPositionsMetadataParam, GetPositionsResponse200, GetQuoteMetadataParam, GetQuoteResponse200, GetQuoteResponse400, GetQuoteResponse403, GetQuoteResponse404, GetQuoteResponse500, GetQuotesMetadataParam, GetQuotesResponse200, GetQuotesResponse400, GetQuotesResponse403, GetQuotesResponse500, GetRfQsMetadataParam, GetRfQsResponse200, GetRfQsResponse400, GetRfQsResponse403, GetRfQsResponse500, GetRfqMetadataParam, GetRfqResponse200, GetRfqResponse400, GetRfqResponse404, GetRfqResponse500, GetSeriesMetadataParam, GetSeriesResponse200, GetStructuredTargetMetadataParam, GetStructuredTargetResponse200, GetTradesMetadataParam, GetTradesResponse200, LookupTickersForMarketInMultivariateEventCollectionBodyParam, LookupTickersForMarketInMultivariateEventCollectionMetadataParam, LookupTickersForMarketInMultivariateEventCollectionResponse200 } from './types';
