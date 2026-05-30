import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import App from './App';

function renderApp() {
  return render(
    <HashRouter>
      <App />
    </HashRouter>,
  );
}

describe('App', () => {
  it('renders the dashboard by default', () => {
    renderApp();
    expect(screen.getByText('準備儀表板')).toBeInTheDocument();
    // countdown cards present
    expect(screen.getByText('初賽倒數')).toBeInTheDocument();
    expect(screen.getByText('複賽倒數')).toBeInTheDocument();
  });

  it('navigates to the exam config and starts a session', async () => {
    const user = userEvent.setup();
    renderApp();
    // there are desktop + mobile nav links; click the first 模擬測驗
    await user.click(screen.getAllByText('模擬測驗')[0]);
    await waitFor(() => expect(screen.getByText('模擬測驗設定')).toBeInTheDocument());

    await user.click(screen.getByText('開始作答'));
    // running phase shows progress text
    await waitFor(() => expect(screen.getByText(/進度 1 \//)).toBeInTheDocument());

    // selecting an option then submitting reveals the explanation
    const optionA = screen.getAllByText('A')[0];
    await user.click(optionA);
    await user.click(screen.getByText('送出答案'));
    await waitFor(() => expect(screen.getByText('詳解')).toBeInTheDocument());
  });
});
