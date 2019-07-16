/*
 * SPDX-License-Identifier: Apache-2.0
*/

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { CommodityContract } from './commodity-contract';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');
import { Commodity } from './commodity';

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
    };
}

describe('CommodityContract', () => {

    let contract: CommodityContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new CommodityContract();
        ctx = new TestContext();
        const commodity1 = new Commodity('1001', '', '', 50, 0, {
                'state': 2,
                "updateTime": "2019-07-10T22:18:12.129Z"
        }, [], []);
        const commodity2 = new Commodity('1002', '', '', 50, 0, {
            'state': 2,
            "updateTime": "2019-07-10T22:18:12.129Z"
        }, [], []);
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from(JSON.stringify(commodity1)));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from(JSON.stringify(commodity2)));
    });

    describe('#commodityExists', () => {

        it('should return true for a commodity', async () => {
            await contract.commodityExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a commodity that does not exist', async () => {
            await contract.commodityExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCommodity', () => {

        it('should create a commodity', async () => {
            const commodity = new Commodity('1003', '', '', 50, 0, {}, [], []);
            await contract.createCommodity(ctx, '1003', commodity);
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"commodity 1003 value"}'));
        });

        it('should throw an error for a commodity that already exists', async () => {
            const commodity = new Commodity('1001', '', '', 50, 0, {}, [], []);
            await contract.createCommodity(ctx, '1001', commodity).should.be.rejectedWith(/The commodity 1001 already exists/);
        });

    });

    describe('#readCommodity', () => {

        it('should return a commodity', async () => {
            await contract.readCommodity(ctx, '1001').should.eventually.deep.equal({ value: 'commodity 1001 value' });
        });

        it('should throw an error for a commodity that does not exist', async () => {
            await contract.readCommodity(ctx, '1003').should.be.rejectedWith(/The commodity 1003 does not exist/);
        });

    });

    describe('#updateCommodity', () => {

        it('should update a commodity', async () => {
            await contract.updateCommodity(ctx, '1001', null);
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"commodity 1001 new value"}'));
        });

        it('should throw an error for a commodity that does not exist', async () => {
            await contract.updateCommodity(ctx, '1003', null).should.be.rejectedWith(/The commodity 1003 does not exist/);
        });

    });

    describe('#deleteCommodity', () => {

        it('should delete a commodity', async () => {
            await contract.deleteCommodity(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a commodity that does not exist', async () => {
            await contract.deleteCommodity(ctx, '1003').should.be.rejectedWith(/The commodity 1003 does not exist/);
        });

    });
});
