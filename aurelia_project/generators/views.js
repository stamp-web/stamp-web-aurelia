import {inject} from 'aurelia-dependency-injection';
import {Project, ProjectItem, CLIOptions, UI} from 'aurelia-cli';

@inject(Project, CLIOptions, UI)
export default class ViewGenerator {
    constructor(project, options, ui) {
        this.project = project;
        this.options = options;
        this.ui = ui;
    }

    execute() {
        return this.ui
            .ensureAnswer(this.options.args[0], 'What would you like to call the new item?')
            .then(name => {
                this.ui.ensureAnswer(this.options.args[1], 'Do you want to implement EventManaged?')
                    .then(events => {
                        let genEvents = ( events && events.toUpperCase() === 'YES');
                        let fileName = this.project.makeFileName(name);
                        let className = this.project.makeClassName(name);
                       /* if ( !this.project.views ) {
                            this.project.views = {
                                name: 'src/resources/views',
                                isDirectory: true,
                                _fileExistsStrategy: 'replace'
                            };
                        } */
                        // need to change elements to views
                        this.project.elements.add(ProjectItem.text(`${fileName}.js`, this.generateSource(className, genEvents)));
                        return this.project.commitChanges().then(() => this.ui.log(`Created ${fileName}.`));
                    });
                return;
            });
    }

    generateSource(className, genEvents) {
        let code = "import {bindable} from 'aurelia-framework';\n" +
            ((genEvents) ? "import {EventManaged} from '../../events/event-managed';\n\n" : "") +
            "export class " + className + ((genEvents) ? " extends EventManaged" : "") + "{\n" +
            "    @bindable value;\n" +
            "}\n";
        return code;
    };
}
