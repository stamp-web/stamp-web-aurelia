import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.info);

if( window.location.href.indexOf('debug=true') >= 0 ) {
	LogManager.setLevel(LogManager.logLevel.debug);
}

export function configure(aurelia) {
	aurelia.use
		.standardConfiguration()
		.developmentLogging()
		.plugin('./global-resources/index') // install our app's resources
		.plugin('aurelia-bs-modal');

	aurelia.start().then(a => a.setRoot());
}
