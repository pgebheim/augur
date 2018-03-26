import { eachOf } from 'async'
import { updateOrderBook } from 'modules/bids-asks/actions/update-order-book'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import logError from 'utils/log-error'

export const updateSingleMarketOrderBook = (updatedOrdersInMarket, isOrderCreation) => (dispatch, getState) => (
  Object.keys(updatedOrdersInMarket).forEach(outcome => updatedOrdersInMarket[outcome].forEach(orderLog => (
    dispatch(updateOrderBook(orderLog.marketId, outcome, orderLog.orderType, getState().orderBooks[orderLog.marketId]))
  )))
)

export const updateOrdersInMarket = (marketId, updatedOrdersInMarket, isOrderCreation, callback = logError) => (dispatch, getState) => {
  const isMarketDataLoaded = getState().marketsData[marketId] != null
  if (isMarketDataLoaded) {
    dispatch(updateSingleMarketOrderBook(updatedOrdersInMarket, isOrderCreation))
    callback(null)
  } else {
    dispatch(loadMarketsInfo([marketId], (err) => {
      if (err) return callback(err)
      dispatch(updateSingleMarketOrderBook(updatedOrdersInMarket, isOrderCreation))
      callback(null)
    }))
  }
}

export const updateOrder = (order, isOrderCreation, callback = logError) => (dispatch, getState) => (
  dispatch(updateOrdersInMarket(order.marketId, { [order.outcome]: [order] }, isOrderCreation, callback))
)

export const updateOrders = (orders, isOrderCreation, callback = logError) => (dispatch, getState) => (
  eachOf(orders, (ordersInMarket, marketId, nextMarketOrders) => (
    dispatch(updateOrdersInMarket(marketId, ordersInMarket, isOrderCreation, nextMarketOrders))
  ), callback)
)
