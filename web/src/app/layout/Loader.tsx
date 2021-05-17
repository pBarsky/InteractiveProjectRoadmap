import { Dimmer, Loader as SemanticLoader } from 'semantic-ui-react';

interface LoaderProps {
  inverted?: boolean;
  content?: string;
}

const Loader = ({ inverted = true, content = 'Loading...' }: LoaderProps) => {
  return (
    <Dimmer active={true} inverted={inverted}>
      <SemanticLoader content={content} />
    </Dimmer>
  );
};

export default Loader;
