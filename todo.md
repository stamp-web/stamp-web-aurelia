## Active Todo List ##

* Work on application eventing
* Browser url parsing (standard library I can use?)
* Properly refactor odata-parser
* interaction between components.  entity-list needs edit, but title is only bindable from manage-list.  What if we want an action in the manage-list.  We should use event publish/subscribing
* The entity list table should be a component
* stamp list is long.  Can we shorten it?  Perhaps sort functions can be a separate object?
* move css to .js as static resources?
* updateCountries in country-editor.html is not binding correctly


SessionContext work
SortColumn stuff needs to be worked - could likely just use a string and then localized text is the translation of this
Not sure if we should have paging/sort/direction stored in SessionContext or not yet



jspm install aurelia-animator-css aurelia-binding aurelia-bootstrapper aurelia-dependency-injection aurelia-framework aurelia-http-client aurelia-router aurelia-event-aggregator aurelia-history-browser aurelia-loader-default aurelia-loader aurelia-metadata aurelia-route-recognizer aurelia-templating-binding aurelia-templating-resources aurelia-templating-router aurelia-templating aurelia-logging aurelia-task-queue aurelia-history aurelia-path


http://plnkr.co/edit/OPOKxRiyRDwzBM92YlcG?p=preview

 <tr repeat.for="row of rows" click.delegate="$parent.edit(row)">
        <template if.bind="$parent.selectedRow == row">
          <td>
            <input value.bind="row.name" />
          </td>
          <td>
            <input value.bind="row.description" />
          </td>
        </template>
        <template if.bind="$parent.selectedRow != row">
          <td>${row.name}</td>
          <td>${row.description}</td>
        </template>
      </tr>




Fixing StampEditor and if.bind

Remove the editingStamp as null...

this.subscribe(EventNames.stampEditorCancel, () => {
            self.editorShown = false;
         //   self.editingStamp = null;

        });

