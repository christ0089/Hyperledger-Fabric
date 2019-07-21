/*
 * SPDX-License-Identifier: Apache-2.0

*/
import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { ShelterSpaceContract } from './shelter-space-contract';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');
import { ShelterSpace } from './shelterSpace';

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class ShelterContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('ShelterSpaceContract', () => {

    let contract: ShelterSpaceContract;
    let ctx: ShelterContext;

    beforeEach(() => {
        contract = new ShelterSpaceContract();
        ctx = new ShelterContext();
        const shelter1 = new ShelterSpace();
        shelter1.shelterId = '1001';
        shelter1.value = 'commodity 1001 value';
        const shelter2 = new ShelterSpace();
        shelter2.shelterId = '1002';
        shelter2.value = 'commodity 1002 value';
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from(JSON.stringify(shelter1)));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from(JSON.stringify(shelter2)));
    });

    describe('#shelterSpaceExists', () => {

        it('should return true for a commodity', async () => {
            await contract.shelterSpaceExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a commodity that does not exist', async () => {
            await contract.shelterSpaceExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createShelterSpace', () => {

        it('should create a commodity', async () => {

            await contract.createShelterSpace(ctx, '1003', 150);
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"commodity 1003 value"}'));
        });

        it('should throw an error for a commodity that already exists', async () => {
            await contract.createShelterSpace(ctx, '1001', 100).should.be.rejectedWith(/The ShelterSpace 1003 does not exist/);
        });

    });

    describe('#readShelterSpace', () => {

        it('should return a commodity', async () => {
            await contract.readShelterSpace(ctx, '1001').should.eventually.deep.equal({ value: 'commodity 1001 value' });
        });

        it('should throw an error for a commodity that does not exist', async () => {
            await contract.readShelterSpace(ctx, '1003').should.be.rejectedWith(/The ShelterSpace 1003 does not exist/);
        });

    });

    describe('#updateShelterSpace', () => {

        it('should update a commodity', async () => {
            await contract.updateShelterSpace(ctx, '1001', 200);
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"commodity 1001 new value"}'));
        });

        it('should throw an error for a commodity that does not exist', async () => {
            await contract.updateShelterSpace(ctx, '1003', 200).should.be.rejectedWith(/The ShelterSpace 1003 does not exist/);
        });

    });

    describe('#deleteShelterSpace', () => {

        it('should delete a commodity', async () => {
            await contract.deleteShelterSpace(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a commodity that does not exist', async () => {
            await contract.deleteShelterSpace(ctx, '1003').should.be.rejectedWith(/The ShelterSpace 1003 does not exist/);
        });

    });

});