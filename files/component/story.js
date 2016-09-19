import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import StoryRoot from 'components/root/root.story';

import Component from './index';
import ComponentDescription from 'components/modules/AAAStorybookIndex/ComponentDescription';

function getComponent(props = {}, title) {
	return (
		<div>
			<ComponentDescription title={title}>
				<h3>Description</h3>
				Describe in a few words what the component does, how it works, what is its purpose...

				<h3>Implements</h3>
				<ul>
					<li><a href='#' onClick={linkTo('List/All/Implemented/Components')}>List/All/Implemented/Components</a></li>
				</ul>

				<h3>Implemented by</h3>
				<ul>
					<li><a href='#' onClick={linkTo('List/All/Implementing/Components')}>List/All/Implementing/Components</a></li>
				</ul>

				<h3>Visible at</h3>
				<ul>
					<li>Your order confirmation page <a href="http://localhost:3232/renderingpage" target="_blank">/renderingpage</a></li>
				</ul>

			</ComponentDescription>
			<Component {...props} />
			<br />

		</div>
	);
}

const modulePath = 'Path/To/YourComponent/Should/Be/Unique';

storiesOf(modulePath, module)

	.addDecorator(getStory => <StoryRoot>{getStory()}</StoryRoot>)

	.add('default view', () => {
		return getComponent({}, `${modulePath} (default view)`);
	})

	;
