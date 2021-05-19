import React from 'react';
import { Dimmer, Loader as SemanticLoader, Segment } from 'semantic-ui-react';

interface LoaderProps {
  inverted?: boolean;
  content?: string;
  inline?: boolean | 'centered';
}

const Loader = ({
  inverted = true,
  content = 'Loading...',
  inline
}: LoaderProps) => {
  return (
    <Segment style={{ minHeight: '20vh' }}>
      <Dimmer active={true} inverted={inverted}>
        <SemanticLoader content={content} inline={inline} />
      </Dimmer>
    </Segment>
  );
};

export default Loader;
