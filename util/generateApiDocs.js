var child_process = require('child_process');
var execSync = child_process.execSync;

execSync("docha -p 'spec/elementHelper.spec.js' -o 'docs/elementHelper.md' -e _");
execSync("docha -p 'spec/transform.spec.js' -o 'docs/transform.md' -e _");

execSync("docha -p 'spec/generalStepDefs/covered_by.spec.js' -o 'docs/generalStepDefs/covered_by.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/i_am_on_the_page.spec.js' -o 'docs/generalStepDefs/i_am_on_the_page.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/i_click_back_in_my_browser.spec.js' -o 'docs/generalStepDefs/i_click_back_in_my_browser.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/i_click_the_link.spec.js' -o 'docs/generalStepDefs/i_click_the_link.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/i_have_a_x_screen_size.spec.js' -o 'docs/generalStepDefs/i_have_a_x_screen_size.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/i_refresh_the_page.spec.js' -o 'docs/generalStepDefs/i_refresh_the_page.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/i_select_in_the_drop_down_list.spec.js' -o 'docs/generalStepDefs/i_select_in_the_drop_down_list.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/i_should_be_on_the_page.spec.js' -o 'docs/generalStepDefs/i_should_be_on_the_page.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/i_type_in_the_field.spec.js' -o 'docs/generalStepDefs/i_type_in_the_field.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/should_appear_in_the_drop_down_list.spec.js' -o 'docs/generalStepDefs/should_appear_in_the_drop_down_list.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/should_be_selected_in_the_drop_down_list.spec.js' -o 'docs/generalStepDefs/should_be_selected_in_the_drop_down_list.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/should_have_the_text.spec.js' -o 'docs/generalStepDefs/should_have_the_text.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/the_should_be_active.spec.js' -o 'docs/generalStepDefs/the_should_be_active.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/the_should_be_checked.spec.js' -o 'docs/generalStepDefs/the_should_be_checked.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/the_should_be_displayed.spec.js' -o 'docs/generalStepDefs/the_should_be_displayed.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/the_should_be_enabled.spec.js' -o 'docs/generalStepDefs/the_should_be_enabled.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/the_should_be_present.spec.js' -o 'docs/generalStepDefs/the_should_be_present.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/the_should_have_the_placeholder_text.spec.js' -o 'docs/generalStepDefs/the_should_have_the_placeholder_text.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
execSync("docha -p 'spec/generalStepDefs/the_title_should_equal.spec.js' -o 'docs/generalStepDefs/the_title_should_equal.md' -e _ -r 'spec/generalStepDefs/support/initGlobals.js'");
