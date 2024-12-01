const newPageTemplate = (name) =>
  `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${name}',
  description: '',
}

export default function ${name}(){
    return (
     <div>${name} page</div>
    )
}
`;

export default newPageTemplate;
