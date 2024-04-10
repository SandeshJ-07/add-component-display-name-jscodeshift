# Add Component DisplayName

This repository contains a jscodeshift script to add the `displayName` property to default exported React components in a specified folder.

## Usage

### Prerequisites

- Node.js installed on your machine
- npm or yarn package manager installed on your machine

### Installation

1. Clone this repository:

    ```bash
    git clone <repository_url.git>
    ```

2. Navigate to the repository directory:

    ```bash
    cd add-component-display-name
    ```

3. Install dependencies:

    ```bash
     yarn install
    ```

### Running the Script

1. Place your React components in the specified folder (eg app/components/).
2. Run the jscodeshift script:

    ```bash
     yarn jscodeshift <folder_path> -t add-component-display-name/index.js 
    ```

    Replace `<folder_path>` with the path to the folder containing your React components.

3. The script will add the `displayName` property to each default exported React component in the specified folder.

### Example

Suppose you have the following React component `MyComponent` in the folder `components/`:

```javascript
import React from 'react';

const MyComponent = () => {
  return <div>Hello, World!</div>;
};

export default MyComponent;
```

Run the command:

```bash
 yarn jscodeshift components/ -t add-component-display-name/index.js 
```

This will modify the above file to: 

```javascript
import React from 'react';

const MyComponent = () => {
  return <div>Hello, World!</div>;
};

MyComponent.displayName = "MyComponent";

export default MyComponent;
```