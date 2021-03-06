import React from 'react';
import ReactDOM from 'react-dom';
import TetherComponent from 'react-tether';
import { configure } from '@storybook/react';
import { storiesOf } from '@storybook/react';

import testImage from './testImage.png';

import { setDefaultDelay, isHappoRun } from '../register';

import Button from './src/Button';

class AsyncComponent extends React.Component {
  componentDidMount() {
    setTimeout(() => this.setState({ ready: true }), 80);
  }
  render() {
    if (!this.state) {
      return null;
    }
    return <span>ready!</span>;
  }
}

setDefaultDelay(1);

window.onbeforeunload = function(e) {
  throw 'Failed to render because a page load event was fired';
};

class UnmountFail extends React.Component {
  componentWillUnmount() {
    throw new Error('Failed');
  }
  render() {
    return <span>I throw on unmount</span>;
  }
}

function PortalComponent() {
  const domNode =
    document.getElementById('portal-root') ||
    (() => {
      const el = document.createElement('div');
      el.setAttribute('id', 'portal-root');
      document.body.appendChild(el);
      return el;
    })();
  return ReactDOM.createPortal(<h1>I'm in a portal!</h1>, domNode);
}

function TetheredComponent() {
  return (
    <TetherComponent
      attachment="top left"
      renderTarget={ref => <button ref={ref}>I'm the target</button>}
      renderElement={ref => (
        <div ref={ref} style={{ border: '1px solid red', padding: 10 }}>
          <h2>Tethered Content</h2>
          <p>A paragraph to accompany the title.</p>
        </div>
      )}
    />
  );
}

class DataFetchComponent extends React.Component {
  componentDidMount() {
    var xhr = new XMLHttpRequest();
    xhr.onload = async () => {
      this.setState({
        xhr: true,
      });
      await window.fetch('https://reqres.in/api/users?page=2')
      await window.fetch('https://reqres.in/api/users?page=3')
      this.setState({
        fetch: true,
      });
    };
    xhr.open('GET', 'https://reqres.in/api/users?page=1', true);
    xhr.send();

  }
  render() {
    if (!this.state) {
      return <div>Nothing ready</div>;
    }
    return (
      <ul>
        {this.state.xhr && <li>XHR ready</li>}
        {this.state.fetch && <li>Fetch ready</li>}
      </ul>
    );
  }
}

function loadStories() {
  if (!isHappoRun()) {
    storiesOf('NOT PART OF HAPPO', module).add('default', () => (
      <AsyncComponent />
    ));
  }
  storiesOf('Lazy', module).add('default', () => <AsyncComponent />);
  storiesOf('Portal', module).add('default', () => <PortalComponent />);
  storiesOf('Tethered', module).add('default', () => <TetheredComponent />);
  storiesOf('Data Fetch', module).add('default', () => <DataFetchComponent />);

  storiesOf('Button', module)
    .add('with text', () => <Button>Hello Button</Button>, {
      happo: { delay: 2000 },
    })
    .add('with image', () => (
      <Button>
        <img src={testImage} />
      </Button>
    ))
    .add('with static image', () => (
      <Button>
        <img src='/assets/staticImage.png' />
      </Button>
    ))
    .add('with some emoji', () => (
      <Button>
        <span role="img" aria-label="so cool">
          😀 😎 👍 💯
        </span>
      </Button>
    ));

  storiesOf('Misc', module)
    .add('large', () => (
      <div style={{ width: 400, height: 400, backgroundColor: 'red' }} />
    ))
    .add('failing on unmount', () => {
      return <UnmountFail />;
    })
    .add(
      'failing',
      () => {
        throw new Error('Some error');
        return (
          <Button>
            <img src={testImage} />
          </Button>
        );
      },
      { happo: { delay: 300 } },
    )
}

configure(loadStories, module);
