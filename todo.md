## Active Todo List ##

* Work on application eventing
* Browser url parsing (standard library I can use?)
* Properly refactor odata-parser
* interaction between components.  entity-list needs edit, but title is only bindable from manage-list.  What if we want an action in the manage-list.  We should use event publish/subscribing
* The entity list table should be a component
* stamp list is long.  Can we shorten it?  Perhaps sort functions can be a separate object?
* move css to .js as static resources?
* updateCountries in country-editor.html is not binding correctly



aurelia/validation@0.2.7  - needed to fork santosh-suresh/validation

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

