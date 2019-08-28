import { createKeyPair } from '@decentralized-auth/ntru';
import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import { composeAPI } from '@iota/core';
import { AES, enc } from 'crypto-js';
import { defaultNodeAddress } from './config';
import DateTag from './DateTag';
import {
  dateTagFromBinStr,
  dateTagFromTxTag,
  tagTrytesToDateTag,
} from './helpers';
import { parseRequestMessage } from './iotaUtils';
import { EFillOptions } from '../typings/Constants';
const iota = composeAPI({
  provider: defaultNodeAddress,
});

jest.setTimeout(30000);
describe('Datetag from binary string generation', () => {
  it('should return the min date', () => {
    const dateMin = new DateTag(2019, 6, 10);
    const dateMinBin = dateMin.toBinStr();
    const dateMax = new DateTag(2019, 6, 11);
    const dateBinCheck = dateMinBin.substring(0, dateMinBin.length - 1) + 'X';
    const resMin = dateTagFromBinStr(dateBinCheck, EFillOptions.MIN);
    const resMax = dateTagFromBinStr(dateBinCheck, EFillOptions.MAX);
    expect(resMin).toStrictEqual(dateMin);
    expect(resMax).toStrictEqual(dateMax);
  });
});
describe('AES Encryptin with trytes', () => {
  it('should be the same before and after convertion', () => {
    const secret = 'mySecret';
    const someTest = 'SomeTextToencyrpt';
    const msgEnc = AES.encrypt(someTest, secret).toString();
    const msgEncTryte = asciiToTrytes(msgEnc);
    const msgDecFromTryte = trytesToAscii(msgEncTryte);

    const msgDecBytes = AES.decrypt(msgDecFromTryte, secret);
    const msgDecString = msgDecBytes.toString(enc.Utf8);
    expect(msgEnc).toStrictEqual(msgDecFromTryte);
    expect(someTest).toStrictEqual(msgDecString);
  });
  it('should decrypt message from static input', () => {
    const secret = 'SomeSecret';
    const tagTrytes = 'WAABWABBRAWAUACB9B999999999'.replace(/9*$/, '');
    const msgTrytes =
      'DCWAPBGDSCQBECZCGCVAPAUCPCVCPCQBEDUBECDDLDMDUCBBPATAXBUA9DVAADKBSCCBMDEDABGDLBBCABPBPCLDOBSBJDWAFCZBXBQB9BMDCCTALDMBHDFCRCCDWBECBBMDYBZBMBZANBACDDWBNDCCBBEDTASCMBBCZBXCCBJDTAXARBKDUCZCWBQCDCACWBSCHCWCVBHCQBYBRBOB9DFDECVBUBBBCC9CPACCJDHCZCGDPCACQBED9BZCFDYBKBBCZCQCBCABABUB9BPAPANDUAUABDOBUCTCCDIDUBWANBVCWBCCDDZBRBUAUCUBCDHDXC9DKBVAUB9BZBBDYAWBKBGDRCWCDDLBFDOBLD9D9BYCVBIDLBUBZCXBSCEDABVBKD9DKDUANDEDIDCDQCEDFCKDUAPBQBTAPAXCWAND9DFC9BZBLDFCNDMBVADDCDWCKBVBVAXCUBUAVBOBZAWAZAUAQBFDZBBBLBIDVAUCTCICMBVACB9DWBTAHDUAHDNBNDICOBHCNBRBLBDDPAHCTBPBKBLDLDFDDCECPATBDDNDSBUACDNDYAGCEDHDWAWCCBBCYAEDLDTCJDABSBUAWBDCUBCDBCTCRCDCTBADLDXCICYBVBPACDBCUALBPBNBBBDC9DXAMDGCSBABDDMDNDNBIDTAWCRCUCSCTCZAABKBWCCBMDMBCDQCZCUBWBUCOBPBICZBXAKBKBPCUACBYBOBECUAMDKDVA9CNDHDQBDDBBUCRBXBUAXCLBYBNBWCZBPBEDJDHC9BOBIDBD9CJDMDOBVBACCDRC9BFC9BHDOBXATC9DYBRCBCBB9CMBZBCCABVAUANDPBVCSBYAZCLDFCLBPAKBDDECUBNBWAPAVCDDGDZBMDZAYBWAFDUAQCADFDVASBXAPAXCPAWCPBTADD9DJDCD9BGCSCUAYBYCIDPAPBPAGCZBPAUCNBYBYCEDBCYAHCXBWAWAHCVCCCKDLDTCMDSBADZCPCHDUAZBUASBTASBZBDC9DZCSCADYCZCHDGDCDPCCBBBEDXBLDSCMBTANDGDKDPAECRCRCCD9CGCQCZBBBXBQBDDABTCCCZAGDZCNBPAGCQBZAYBNDSBICWCRBDCVBMBXAVBBBDCKDRBYBFDADVBPBQBWBQBNBZAABRBIDYAACZBACFCABOBCBBDQBYC9DBCKBWABBADLDSC9DVBZBECMBYBABECNBVAGDZAMDECLDACXAYA9CBDHDTAABNBHDVANDCBPAICJDMBKBTBDDYABDZAYC9DWBLDZASCICMBMBFDGCBCTBXBIDHCUASCYBHCKDUBYC9CZABBIDRBYCYAWAVBYADCQBYBWAVBXCUABBICXCXACBDD9BFDZBACRBDCPBZADCKDJDABXAFDHDXCXBECZBWCPATAWBACGCGDQCKBTALBZBQCEDBC9DUBRCYCVARCNDUBPBUBCBECDDFCGDGDWBYBLBQCCDVCZASCFDICADYBDDHCQCABZBXAVC9DBCABICLBRBUCNDQBZAABYAEDACNBQCKBKD9CVAZB9B9DZAFCIDCBNDIDSCBCXBXBZCYCUBRCRBTCHCMBLDCCJDWCYBKBDDKBJDNBPCMDXBDDKDGDJDICDDXCNDVAFCBDDCPBADZCXC9BACTCFCABCBFDYBPABCZASCIDYCCBDDYAMBNDCBFCACGCTCVCKDPAFCDCJDFDRBBCQCBCVANBCBXCECWAWBUCSBWCJDMBPCSCDDDCKDFCADNB9CKBWAIDTBIDBDSCPA9DID9CGDJDJDFCPCACWBEDPCVASBUAECWCTCMDMDECBBWCYCWCGCPCXCOBICVAYA9CDCOBMDPC9CCCGDZBADHDFDUCCDFCGCJDICBDXCTAPBCCGCXCPAEDVAFDDCXBQBYCTCKDOBICRBTAWABCNBLDVCPBFCHCPAOBUCHDUBFCADWCLDLBECWCSCMBCDUCRCLBCDXBSCYBVBBDFCCCUCUCHDWAUAZBBBHCSCCDOBDDPAXCABQCHDBCABCBZAPBCDVANBSCYACDYBZCADHCWCSBQCLDRCXACDVBUBACYBVBMBZBICXBTCMBNBUAKDGBGB';
    const msgDecFromTryte = trytesToAscii(msgTrytes);
    const msgDecBytes = AES.decrypt(msgDecFromTryte, secret);
    const msgDecString = msgDecBytes.toString(enc.Utf8);
    expect(msgDecString).toBe(
      '[{"hash":"XZ9BIZNUEDVCIRSUQWNDTLTYUVNFPUOGAYPXP9EYFCBBCGYKKKGGLYIOGJZCKIIQFZEUJIZCFGJWQNTWF","prefix":"00011111100011011101111"},{"hash":"X9EBYBHOXFHRCWHBFTUPLJCSLIRKQIWLVIOQX9KCF9UBPMDTVXPVZIPYQLDDNGQNTQDTXHSPHBRHGZESH","prefix":"0001111110001101111XXXX"},{"hash":"NMIAAHOJSMNEBMAXTCQQ9FW9BTYRUVSKQLWFYFCWDDPFGDCHOSQRNWZOMWJFZYLDQGMQHQU9NTJTKTNTC","prefix":"00011111100011100100XXX"},{"hash":"SVBPVQ9UBNKBACBMJMAJNZXGGTK9WQAUYSMHNGPFXDQUPCAJUXHFOAGEWATDPWSEKJKUAPNGMVQXLITOH","prefix":"00011111100011100101010"},{"hash":"BBOAXQHXIARXKSILOOUIATOTJV9QOZGGDNZQZLDBCUXPMRERKMU9ZPIEFLCCENISCOOZXFONKTAE9TSZP","prefix":"0001111110001110010100X"},{"hash":"GBTNNACDMWGJFHSGWJQOBAPOUOUWAT9BVENRTSVYJSAX9VLLV9OJWNZYYKFOUGUFXZUGOBRYDDMHMLNAV","prefix":"000111111000111000"}]'
    );
  });
});
describe('tag to Datetag convertions', () => {
  it('should return a datetag', () => {
    const tryt = 'WAUAVACBUABBVA9B99999999999';
    const res = tagTrytesToDateTag(tryt);
    expect(res).toBe('20190816');
  });
  it('should return a Datetag object', () => {
    const tryt = 'WAUAVACBUABBVA9B99999999999';
    const date = dateTagFromTxTag(tryt);
    expect(date.toString()).toBe('20190816');
  });
});