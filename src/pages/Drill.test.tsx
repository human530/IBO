import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import Drill from './Drill';

function renderDrill() {
  return render(
    <HashRouter>
      <Drill />
    </HashRouter>,
  );
}

describe('Drill (刷題練習)', () => {
  it('mixes the three tiers and tracks progress', () => {
    renderDrill();
    expect(screen.getByText('刷題練習')).toBeInTheDocument();
    // three tier toggle buttons are present (accessible name includes 題 count)
    expect(screen.getByRole('button', { name: /初賽/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /複賽/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /國手賽/ })).toBeInTheDocument();
    // progress counter shown for a non-empty deck
    expect(screen.getByText(/進度 1 \//)).toBeInTheDocument();
  });

  it('tapping a single-choice option instantly reveals difficulty + 解析', async () => {
    const user = userEvent.setup();
    renderDrill();
    // restrict to 初賽 so we land on single-choice questions deterministically
    await user.click(screen.getByRole('button', { name: /複賽/ }));
    await user.click(screen.getByRole('button', { name: /國手賽/ }));

    // difficulty dots are shown in the question header before answering
    expect(screen.getByText(/第 1 題/)).toBeInTheDocument();

    // tap the first option pill (A) — single choice reveals instantly
    await user.click(screen.getAllByText('A')[0]);

    // explanation block appears immediately after a single-choice tap
    await waitFor(() => expect(screen.getByText(/完整詳解/)).toBeInTheDocument());
    // accuracy stat is now populated (已答 1)
    expect(screen.getByText(/已答 1/)).toBeInTheDocument();
    // can advance
    expect(screen.getByText(/下一題|完成本輪/)).toBeInTheDocument();
  });
});
