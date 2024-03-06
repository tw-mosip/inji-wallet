const Button = jest.fn().mockReturnValue(null);
const Icon = jest.fn().mockReturnValue(null);

// Mock the ButtonProps
const ButtonProps = {
  // Add any mocked props you need
};

// Export the mock
export {Button as RNEButton, ButtonProps as RNEButtonProps, Icon};
