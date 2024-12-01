const newDefaultComponentTemplate = (name) =>
  `"use client"

interface ${name}Props {}

const ${name} = (props: ${name}Props): JSX.Element => {
    return (
        <div>Component ${name}</div>
        )
    }

export default ${name};

`;

export default newDefaultComponentTemplate;
