const RNFS = require('react-native-fs');

const mockDocumentDirectoryPath = '/mocked/document/directory/path';
const mockReadDirItem: ReadDirItem = {
  name: 'mockedFile.txt',
  path: '/mocked/document/directory/path/mockedFile.txt',
  size: 1024, // Mocked file size in bytes
  isFile: jest.fn(),
  isDirectory: jest.fn(),
};
const mockStatResult: StatResult = {
  size: 1024, // Mocked file size in bytes
  mode: '0644',
};

const mockReadFile = jest.fn();
const mockWriteFile = jest.fn();
const mockUnlink = jest.fn();
const mockExists = jest.fn();
const mockMkdir = jest.fn();
const mockReadDir = jest.fn();
const mockStat = jest.fn();

RNFS.DocumentDirectoryPath = mockDocumentDirectoryPath;
RNFS.readFile = mockReadFile;
RNFS.writeFile = mockWriteFile;
RNFS.unlink = mockUnlink;
RNFS.exists = mockExists;
RNFS.mkdir = mockMkdir;
RNFS.readDir = mockReadDir;
RNFS.stat = mockStat;

export {
  mockDocumentDirectoryPath,
  mockReadDirItem,
  mockStatResult,
  mockReadFile,
  mockWriteFile,
  mockUnlink,
  mockExists,
  mockMkdir,
  mockReadDir,
  mockStat,
};

export default RNFS;
