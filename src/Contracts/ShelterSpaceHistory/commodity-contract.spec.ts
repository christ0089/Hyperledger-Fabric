/*
 * SPDX-License-Identifier: Apache-2.0

*/
import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import {ShelterSpaceContract } from './shelter-space-contract';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');
import { ShelterSpace } from './shelterSpace';

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

    let contract: ShelterSpaceContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new ShelterSpaceContract();
        ctx = new TestContext();
        const shelter1 = new ShelterSpace('1001', 50);
        const shelter2 = new ShelterSpace('1002', 100);
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from(JSON.stringify(shelter1)));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from(JSON.stringify(shelter2)));
    });

    describe('#commodityExists', () => {

        it('should return true for a commodity', async () => {
            await contract.ShelterSpaceExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a commodity that does not exist', async () => {
            await contract.ShelterSpaceExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCommodity', () => {

        it('should create a commodity', async () => {
            const shelter = new ShelterSpace('1003', 150);
            await contract.createShelterSpace(ctx, '1003', shelter);
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"commodity 1003 value"}'));
        });

        it('should throw an error for a commodity that already exists', async () => {
            const shelter = new ShelterSpace('1003', 150);
            await contract.createShelterSpace(ctx, '1001', shelter).should.be.rejectedWith(/The commodity 1001 already exists/);
        });

    });

    describe('#readCommodity', () => {

        it('should return a commodity', async () => {
            await contract.readShelterSpace(ctx, '1001').should.eventually.deep.equal({ value: 'commodity 1001 value' });
        });

        it('should throw an error for a commodity that does not exist', async () => {
            await contract.readShelterSpace(ctx, '1003').should.be.rejectedWith(/The commodity 1003 does not exist/);
        });

    });

    describe('#updateCommodity', () => {

        it('should update a commodity', async () => {
            const shelter = new ShelterSpace('1001', 200);
            await contract.updateShelterSpace(ctx, '1001', shelter);
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"commodity 1001 new value"}'));
        });

        it('should throw an error for a commodity that does not exist', async () => {
            const shelter = new ShelterSpace('1001', 200);
            await contract.updateShelterSpace(ctx, '1003', shelter).should.be.rejectedWith(/The commodity 1003 does not exist/);
        });

    });

    describe('#deleteCommodity', () => {

        it('should delete a commodity', async () => {
            await contract.deleteShelterSpace(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a commodity that does not exist', async () => {
            await contract.deleteShelterSpace(ctx, '1003').should.be.rejectedWith(/The commodity 1003 does not exist/);
        });

    });

});