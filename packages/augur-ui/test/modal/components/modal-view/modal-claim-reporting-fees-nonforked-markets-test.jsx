/**
 * @todo Improve unit tests by:
 * - Adding nonforkedMarkets test data
 * - Adding checks for format of forkedMarket/nonforkedMarkets being passed in
 */

import React from 'react'

import sinon from 'sinon'
import { shallow } from 'enzyme'

import BigNumber from 'bignumber.js'

import ModalClaimReportingFeesNonforkedMarkets from 'src/modules/modal/components/modal-claim-reporting-fees-nonforked-markets/modal-claim-reporting-fees-nonforked-markets'
import { formatAttoRep, formatEther } from 'utils/format-number'

describe('modal-claim-reporting-fees-nonforked-markets', () => {
  let Cmp
  const forkedMarket = {
    markeId: '0xbcde24abef27b2e537b8ded8139c7991de308607',
    universe: '0xu000000000000000000000000000000000000001',
    isFinalized: true,

    crowdsourcers: [
      {
        crowdsourcerId: '0xfc2355a7e5a7adb23b51f54027e624bfe0e23001',
        needsFork: true,
        unclaimedEth: new BigNumber(123.456, 10),
        unclaimedRepStaked: new BigNumber(654.321, 10),
      },
      {
        crowdsourcerId: '0xfc2355a7e5a7adb23b51f54027e624bfe0e23002',
        needsFork: false,
        unclaimedEth: new BigNumber(123.456, 10),
        unclaimedRepStaked: new BigNumber(654.321, 10),
      },
    ],

    initialReporter: {
      initialReporterId: '0xfd2355a7e5a7adb23b51f54027e624bfe0e23001',
      isForked: false,
      unclaimedEth: new BigNumber(123.456, 10),
      unclaimedRepStaked: new BigNumber(654.321, 10),
    },
  }

  describe('When displaying modal for claimable reporting fees', () => {
    describe('When there are no claimable ETH or REP fees', () => {
      let claimReportingFeesNonforkedMarkets
      beforeEach(() => {
        claimReportingFeesNonforkedMarkets = sinon.spy()
        Cmp = shallow(<ModalClaimReportingFeesNonforkedMarkets
          claimReportingFeesNonforkedMarkets={claimReportingFeesNonforkedMarkets}
          closeModal={sinon.spy()}
          recipient="0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB"
          unclaimedEth={formatEther('0', { decimals: 4, zeroStyled: true })}
          unclaimedRep={formatAttoRep('0', { decimals: 4, zeroStyled: true })}
          feeWindows={['0x161c723cac007e4283cee4ba11b15277e46eec53']}
          forkedMarket={forkedMarket}
          nonforkedMarkets={[]}
        />)
      })

      describe('Recipient field', () => {
        it('should match expected recipient address', () => {
          assert.include(Cmp.html(), '<span>Recipient</span><span>0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB</span>')
        })
      })

      describe('REP field', () => {
        it('should match expected claimable REP value', () => {
          assert.include(Cmp.html(), '<span>Rep</span><span>-</span>')
        })
      })

      describe('ETH field', () => {
        it('should match expected claimable ETH value', () => {
          assert.include(Cmp.html(), '<span>Eth</span><span>-</span>')
        })
      })

      describe('claimReportingFeesNonforkedMarkets function', () => {
        it('should get called once with args ', () => {
          assert.isOk(claimReportingFeesNonforkedMarkets)
        })

        it('should receive one argument', () => {
          assert.deepEqual(claimReportingFeesNonforkedMarkets.args[0].length, 1)
        })

        it('should receive first argument that matches expected value', () => {
          const expected = {
            feeWindows: ['0x161c723cac007e4283cee4ba11b15277e46eec53'],
            forkedMarket,
            nonforkedMarkets: [],
            estimateGas: true,
            onSent: claimReportingFeesNonforkedMarkets.args[0][0].onSent,
            onFailed: claimReportingFeesNonforkedMarkets.args[0][0].onFailed,
            onSuccess: claimReportingFeesNonforkedMarkets.args[0][0].onSuccess,
          }
          assert.deepEqual(claimReportingFeesNonforkedMarkets.args[0][0], expected)
        })
      })

      describe('Gas field', () => {
        it('should be zero', () => {
          assert.include(Cmp.html(), '<span>Gas</span><span>0</span>')
        })
      })

      describe('Submit button', () => {
        it('should be disabled', () => {
          const button = Cmp.find('button')
          assert.isOk(button.html().includes('disabled'))
        })
      })
    })

    describe('When there are claimable ETH fees, but no claimable REP fees', () => {
      let claimReportingFeesNonforkedMarkets
      beforeEach(() => {
        claimReportingFeesNonforkedMarkets = sinon.spy()
        Cmp = shallow(<ModalClaimReportingFeesNonforkedMarkets
          claimReportingFeesNonforkedMarkets={claimReportingFeesNonforkedMarkets}
          closeModal={sinon.spy()}
          recipient="0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB"
          unclaimedEth={formatEther('0.123', { decimals: 4, zeroStyled: true })}
          unclaimedRep={formatAttoRep('0', { decimals: 4, zeroStyled: true })}
          feeWindows={['0x161c723cac007e4283cee4ba11b15277e46eec53']}
          forkedMarket={forkedMarket}
          nonforkedMarkets={[]}
        />)
      })

      describe('Recipient field', () => {
        it('should match expected recipient address', () => {
          assert.include(Cmp.html(), '<span>Recipient</span><span>0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB</span>')
        })
      })

      describe('REP field', () => {
        it('should match expected claimable REP value', () => {
          assert.include(Cmp.html(), '<span>Rep</span><span>-</span>')
        })
      })

      describe('ETH field', () => {
        it('should match expected claimable ETH value', () => {
          assert.include(Cmp.html(), '<span>Eth</span><span>0.1230</span>')
        })
      })

      describe('claimReportingFeesNonforkedMarkets function', () => {
        it('should get called once with args ', () => {
          assert.isOk(claimReportingFeesNonforkedMarkets)
        })

        it('should receive one argument', () => {
          assert.deepEqual(claimReportingFeesNonforkedMarkets.args[0].length, 1)
        })

        it('should receive first argument that matches expected value', () => {
          const expected = {
            feeWindows: ['0x161c723cac007e4283cee4ba11b15277e46eec53'],
            forkedMarket,
            nonforkedMarkets: [],
            estimateGas: true,
            onSent: claimReportingFeesNonforkedMarkets.args[0][0].onSent,
            onFailed: claimReportingFeesNonforkedMarkets.args[0][0].onFailed,
            onSuccess: claimReportingFeesNonforkedMarkets.args[0][0].onSuccess,
          }
          assert.deepEqual(claimReportingFeesNonforkedMarkets.args[0][0], expected)
        })
      })

      describe('Gas field', () => {
        it('should match expected claimable Gas value', () => {
          assert.include(Cmp.html(), '<span>Gas</span><span>0</span>')
        })
      })

      describe('Submit button', () => {
        it('should not be disabled', () => {
          const button = Cmp.find('button')
          assert.isNotOk(button.html().includes('disabled'))
        })
      })
    })

    describe('When there are claimable REP fees, but no claimable ETH fees', () => {
      let claimReportingFeesNonforkedMarkets
      beforeEach(() => {
        claimReportingFeesNonforkedMarkets = sinon.spy()
        Cmp = shallow(<ModalClaimReportingFeesNonforkedMarkets
          claimReportingFeesNonforkedMarkets={claimReportingFeesNonforkedMarkets}
          closeModal={sinon.spy()}
          recipient="0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB"
          unclaimedEth={formatEther('0', { decimals: 4, zeroStyled: true })}
          unclaimedRep={formatAttoRep('2000000000000000000', { decimals: 4, zeroStyled: true })}
          feeWindows={['0x161c723cac007e4283cee4ba11b15277e46eec53']}
          forkedMarket={forkedMarket}
          nonforkedMarkets={[]}
        />)
      })

      describe('Recipient field', () => {
        it('should match expected recipient address', () => {
          assert.include(Cmp.html(), '<span>Recipient</span><span>0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB</span>')
        })
      })

      describe('REP field', () => {
        it('should match expected claimable REP value', () => {
          assert.include(Cmp.html(), '<span>Rep</span><span>2.0000</span>')
        })
      })

      describe('ETH field', () => {
        it('should match expected claimable ETH value', () => {
          assert.include(Cmp.html(), '<span>Eth</span><span>-</span>')
        })
      })

      describe('claimReportingFeesNonforkedMarkets function', () => {
        it('should get called once with args ', () => {
          assert.isOk(claimReportingFeesNonforkedMarkets)
        })

        it('should receive one argument', () => {
          assert.deepEqual(claimReportingFeesNonforkedMarkets.args[0].length, 1)
        })

        it('should receive first argument that matches expected value', () => {
          const expected = {
            feeWindows: ['0x161c723cac007e4283cee4ba11b15277e46eec53'],
            forkedMarket,
            nonforkedMarkets: [],
            estimateGas: true,
            onSent: claimReportingFeesNonforkedMarkets.args[0][0].onSent,
            onFailed: claimReportingFeesNonforkedMarkets.args[0][0].onFailed,
            onSuccess: claimReportingFeesNonforkedMarkets.args[0][0].onSuccess,
          }
          assert.deepEqual(claimReportingFeesNonforkedMarkets.args[0][0], expected)
        })
      })

      describe('Gas field', () => {
        it('should match expected claimable Gas value', () => {
          assert.include(Cmp.html(), '<span>Gas</span><span>0</span>')
        })
      })

      describe('Submit button', () => {
        it('should not be disabled', () => {
          const button = Cmp.find('button')
          assert.isNotOk(button.html().includes('disabled'))
        })
      })
    })

    describe('When there are claimable ETH fees and REP fees', () => {
      let claimReportingFeesNonforkedMarkets
      beforeEach(() => {
        claimReportingFeesNonforkedMarkets = sinon.spy()
        Cmp = shallow(<ModalClaimReportingFeesNonforkedMarkets
          claimReportingFeesNonforkedMarkets={claimReportingFeesNonforkedMarkets}
          closeModal={sinon.spy()}
          recipient="0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB"
          unclaimedEth={formatEther('0.123', { decimals: 4, zeroStyled: true })}
          unclaimedRep={formatAttoRep('2000000000000000000', { decimals: 4, zeroStyled: true })}
          feeWindows={['0x161c723cac007e4283cee4ba11b15277e46eec53']}
          forkedMarket={forkedMarket}
          nonforkedMarkets={[]}
        />)
      })

      describe('Recipient field', () => {
        it('should match expected recipient address', () => {
          assert.include(Cmp.html(), '<span>Recipient</span><span>0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB</span>')
        })
      })

      describe('REP field', () => {
        it('should match expected claimable REP value', () => {
          assert.include(Cmp.html(), '<span>Rep</span><span>2.0000</span>')
        })
      })

      describe('ETH field', () => {
        it('should match expected claimable ETH value', () => {
          assert.include(Cmp.html(), '<span>Eth</span><span>0.1230</span>')
        })
      })

      describe('claimReportingFeesNonforkedMarkets function', () => {
        it('should get called once with args ', () => {
          assert.isOk(claimReportingFeesNonforkedMarkets)
        })

        it('should receive one argument', () => {
          assert.deepEqual(claimReportingFeesNonforkedMarkets.args[0].length, 1)
        })

        it('should receive first argument that matches expected value', () => {
          const expected = {
            feeWindows: ['0x161c723cac007e4283cee4ba11b15277e46eec53'],
            forkedMarket,
            nonforkedMarkets: [],
            estimateGas: true,
            onSent: claimReportingFeesNonforkedMarkets.args[0][0].onSent,
            onFailed: claimReportingFeesNonforkedMarkets.args[0][0].onFailed,
            onSuccess: claimReportingFeesNonforkedMarkets.args[0][0].onSuccess,
          }
          assert.deepEqual(claimReportingFeesNonforkedMarkets.args[0][0], expected)
        })
      })

      describe('Gas field', () => {
        it('should match expected claimable Gas value', () => {
          assert.include(Cmp.html(), '<span>Gas</span><span>0</span>')
        })
      })

      describe('Submit button', () => {
        it('should not be disabled', () => {
          const button = Cmp.find('button')
          assert.isNotOk(button.html().includes('disabled'))
        })
      })
    })
  })
})
