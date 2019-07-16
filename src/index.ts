/*
 * SPDX-License-Identifier: Apache-2.0
 */

//const ShelterSpaceContract = require('./Contracts/ShelterSpaceHistory/shelter-space-contract');
import { CommodityContract } from './Contracts/ComodityContract/commodity-contract';

//module.exports.shelter = ShelterSpaceContract;
module.exports.commodity = CommodityContract;
module.exports.contracts = [ CommodityContract ];
