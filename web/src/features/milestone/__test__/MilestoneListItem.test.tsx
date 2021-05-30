import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Milestone } from '../../../app/models/milestone';
import MilestoneListItem from '../MilestoneListItem';

describe('<MilestoneListItem/>', () => {
  const defaultTestMilestone: Milestone = {
    description: 'sample description',
    endsOn: new Date('2020-03-15'),
    status: 0,
    parentProjectId: 1,
    id: 1,
    name: 'sample name'
  };

  it('Should render all properties of milestone', () => {
    const testMilestone: Milestone = { ...defaultTestMilestone };
    const { getByText } = render(<MilestoneListItem milestone={testMilestone} />);

    waitFor(() => {
      expect(getByText(testMilestone.name)).toBeInTheDocument();
      expect(getByText(testMilestone.status)).toBeInTheDocument();
      expect(
        getByText(new RegExp(testMilestone.endsOn!.toLocaleDateString(), 'i'))
      ).toBeInTheDocument();
    });
  });
  it('Should show description after click on', () => {
    const repeatWord = '😎🤙';

    const { getByText } = render(
      <MilestoneListItem
        milestone={{ ...defaultTestMilestone, description: repeatWord.repeat(50) }}
      />
    );
    act(() => userEvent.click(getByText(defaultTestMilestone.name)));

    waitFor(() => expect(getByText(new RegExp(`${repeatWord}`))).toBeInTheDocument());
  });
});
