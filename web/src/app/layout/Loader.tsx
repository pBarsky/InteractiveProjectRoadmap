import React from 'react';
import { Dimmer, Loader as SemanticLoader, Segment } from 'semantic-ui-react';

interface LoaderProps {
  inverted?: boolean;
  content?: string;
  inline?: boolean | 'centered';
  page?: boolean;
}

const Loader = ({
  inverted = true,
  content = 'Loading...',
  inline,
  page = false
}: LoaderProps) => {
  return (
    <Segment style={{ minHeight: page ? '100vh' : '20vh' }}>
      <Dimmer active={true} inverted={inverted}>
        <SemanticLoader content={content} inline={inline} />
      </Dimmer>
    </Segment>
  );
};

export default Loader;
