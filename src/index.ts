/*
 * SPDX-License-Identifier: Apache-2.0
 module.exports.commodity = CommodityContract;
*/
import { CommodityContract } from './Contracts/ComodityContract/commodity-contract';
export { CommodityContract } from './Contracts/ComodityContract/commodity-contract';

import { ShelterSpaceContract } from './Contracts/ShelterSpaceHistory/shelter-space-contract';
export { ShelterSpaceContract } from './Contracts/ShelterSpaceHistory/shelter-space-contract';

export const contracts: any[] = [ ShelterSpaceContract, CommodityContract ];
