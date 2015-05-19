export function configure(aurelia) {
	aurelia.use
		.standardConfiguration()
		.developmentLogging()
		.plugin('./global-resources/index') // install our app's resources
		.plugin('aurelia-bs-modal');

	aurelia.start().then(a => a.setRoot());
}
