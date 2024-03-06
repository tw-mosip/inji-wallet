const RNZipArchive = require('react-native-zip-archive');

const mockUnzip = jest.fn();
const mockZip = jest.fn();

RNZipArchive.unzip = mockUnzip;
RNZipArchive.zip = mockZip;

export default RNZipArchive;
