## Description

When placed inside  form tag this code behaves the following way:
On form submit search for the textbox and its value send requesy to alterra faq api and open alterra widgit.
Client can close widgit, in this case questions should be submited the regular way.


## Usage

Place following snippet inside the form tag of the QA form to enable redirection.\
    ```
    <script src="http://next.alterra.ai/dev/outpost/static/redirect.js" id="alterra-faq" data-product-id="%YOUR PRODUCT ID%"></script>
    ```

