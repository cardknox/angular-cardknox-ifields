# angular-cardknox-ifields

## An Angular component for Cardknox iFields

---

## Cardknox

Cardknox is a developer-friendly payment gateway integration provider for in-store, online, or mobile transactions

**Sandbox:** https://www.cardknox.com/sandbox/

**iFields:** https://www.cardknox.com/ifields/

A sandbox or live account is required to use this component

---

## Inputs

There are 2 basic inputs required to get this up and running.

#### 1. Type

There are three types of payment data iFields supports:
* Credit Card
* CVV
* ACH

```
    <cardknox-ifields [type]="CARD"></cardknox-ifields>
```

The possible values for this property are 
* card
* cvv
* ach

These can be imported from the component

```
    import { ACH_TYPE, CARD_TYPE, CVV_TYPE, AngularIfieldsComponent } from '@cardknox/angular-ifields';

    /**...*/

    CARD = CARD_TYPE;
```

#### 2. Account
Pass your [iFields key](https://www.cardknox.com/ifields/) to the component in the **account** input like this:

```
    <cardknox-ifields [account]="account"></cardknox-ifields>
    
    /**...*/

    account = {
        xKey: '{Your iFields key}',
        xSoftwareName: '{The name of your app}',
        xSoftwareVersion: '{Your app's version}'
    }
```

---

## Events

There are 2 lifecycle events and 7 user events.

---

### Lifecycle events

#### 1. Load

Is emitted when the iframe has loaded

```
      <cardknox-ifields (load)="onLoad"></cardknox-ifields>
```

#### 2. Token

Is emitted when a token is received from the iField

```
      <cardknox-ifields (token)="onToken"></cardknox-ifields>
```

---

### User events

User events are events passed along from iFields when the user interacts with it.

The available events are
1. click
1. dblclick
1. focus
1. blur
1. input
1. change
1. submit*

\* the submit event works slightly differently, see below.

#### Update

Aside from submit, the above events can be collected on a single event `update`. This is **not** recommended as it will cause an unnecessary amount of function calls. Instead subscribe only to the events you want to act on.

The event [payload]() is in `e.data`. The data also contains the event so you can subscribe to multiple events with a single function and a `switch` statement like this:

```
    <cardknox-ifields (update)="onUpdate($event)"></cardknox-ifields>

    /**...*/

    onUpdate({ data }) {
        switch (data.event) {
            case 'input':
                console.log("input event received");
                break;
            case 'click':
                console.log("click event received");
                break;
        }
    }
```

#### Submit

This event is triggered when the user submits the form from within the iFrame.

This event works differently than other user events. 
* This event is only emitted if prop `options.autoSubmit` is true. (This is the default.) 
* Subscribing to `update` will not work as mentioned above. 
* The data passed along with this event is slightly different, (see below).

```
    <form id="form">
        <cardknox-ifields [options]="options" (submit)="onSubmit"></cardknox-ifields>
    </form>

    /**...*/

    onSubmit() {
        document.getElementById('form').dispatchEvent(
            new Event("submit", {
                bubbles: true,
                cancelable: true
            })
        );
    }
    
    options = {
        autoSubmit: true
    }
```

It is also possible to have the component automatically submit the form for you when _submit_ is triggered from the iFrame.If `autoSubmitFormId` is set on the options prop the component will call submit on the element with that ID. This is useful for smaller applications relying on the form element to handle submission.

```
    <form id="form">
        <cardknox-ifields [options]="options"></cardknox-ifields>
    </form>

    /**...*/
    
    options = {
        autoSubmit: true,
        autoSubmitFormId: 'form'
    }
```

### Error

There is also an error event that can be subscribed to.

---

## Actions

There are 3 actions available on this component as well

### Focus

`focusIfield`

This action will set the focus to the ifield when called

### Clear

`clearIfield`

This action will clear the data from the ifield when called

### Get Token

`getToken`

This action will load the token for the ifield when called.

```
  <cardknox-ifields #card></cardknox-ifields>

  @ViewChild('card') cardIfield?: AngularIfieldsComponent;

  this.cardIfield.focusIfield();
  this.cardIfield.clearIfield();
  this.cardIfield.getToken();
```

---

## Inputs

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
        <th>Valid values</th>
    </tr>
    <tr>
        <td>type</td>
        <td>String</td>
        <td>iFields type</td>
        <td>
            <ul>
                <li>card</li>
                <li>cvv</li>
                <li>ach</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>account</td>
        <td><a href="">Account</a></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>options</td>
        <td><a href="">Options</a></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>threeDS</td>
        <td><a href="">ThreeDS</a></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>issuer</td>
        <td>String</td>
        <td>Card issuer</td>
        <td>For cvv iField only</td>
    </tr>
</table>

### Account

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>xKey</td>
        <td>String</td>
        <td>iFields key</td>
    </tr>
    <tr>
        <td>xSoftwareName</td>
        <td>String</td>
        <td>Software name</td>
    </tr>
    <tr>
        <td>xSoftwareVersion</td>
        <td>String</td>
        <td>Software version</td>
    </tr>
</table>

### Options

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>enableLogging</td>
        <td>Boolean</td>
        <td>Turn iField logs to the console on and off</td>
    </tr>
    <tr>
        <td>autoFormat</td>
        <td>Boolean</td>
        <td>Turn iField auto-formatting on and off. This is only used for iFields of <i>card</i> type. See <i>autoFormatSeparator</i></td>
    </tr>
    <tr>
        <td>autoFormatSeparator</td>
        <td>String</td>
        <td>A string to be used to auto-format card numbers when <i>autoFormat</i> is turned on. The default value is " " (space).</td>
    </tr>
    <tr>
        <td>autoSubmit</td>
        <td>Boolean</td>
        <td>Turn on capturing a submit event triggered from within the iFrame. Default is <code>true</code>.</td>
    </tr>
    <tr>
        <td>autoSubmitFormId</td>
        <td>String</td>
        <td>If autoSubmit is true, the ID of a form element can be set and the component will trigger <i>submit</i> on the form when submit is triggered in the iFrame.</td>
    </tr>
    <tr>
        <td>placeholder</td>
        <td>String</td>
        <td>Text to be used as <i>placeholder</i> text for the input field.</td>
    </tr>
    <tr>
        <td>iFieldstyle</td>
        <td>Object</td>
        <td>A style object to be used to style the iFields input element. This object is assigned to <b>HTMLElement.style</b>.</td>
    </tr>
</table>

### ThreeDS

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>enable3DS</td>
        <td>Boolean</td>
        <td>Turn 3DSecure on and off</td>
    </tr>
    <tr>
        <td>waitForResponse</td>
        <td>Boolean</td>
        <td>Determine whether iFields should wait for a response from 3DSecure before getting the token</td>
    </tr>
    <tr>
        <td>waitForResponseTimeout</td>
        <td>Number</td>
        <td>The 3DSecure response timeout in milli-seconds. The default value is 2000 (2 seconds).</td>
    </tr>
    <tr>
        <td>amount</td>
        <td>Number</td>
        <td>The transaction amount</td>
    </tr>
    <tr>
        <td>month</td>
        <td>Number</td>
        <td>The 2-digit card expiration month</td>
    </tr>
    <tr>
        <td>year</td>
        <td>Number</td>
        <td>The 2-digit card expiration year</td>
    </tr>
</table>

### Update Event Data

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>enable3DS</td>
        <td>Boolean</td>
        <td>Turn 3DSecure on and off</td>
    </tr>
    <tr>
        <td>waitForResponse</td>
        <td>Boolean</td>
        <td>Determine whether iFields should wait for a response from 3DSecure before getting the token</td>
    </tr>
    <tr>
        <td>waitForResponseTimeout</td>
        <td>Number</td>
        <td>The 3DSecure response timeout in milli-seconds. The default value is 2000 (2 seconds).</td>
    </tr>
    <tr>
        <td>amount</td>
        <td>Number</td>
        <td>The transaction amount</td>
    </tr>
    <tr>
        <td>month</td>
        <td>Number</td>
        <td>The 2-digit card expiration month</td>
    </tr>
    <tr>
        <td>year</td>
        <td>Number</td>
        <td>The 2-digit card expiration year</td>
    </tr>
</table>

### Error Data

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>result</td>
        <td>String</td>
        <td>This will always have the value of <code>error</code></td>
    </tr>
    <tr>
        <td>errorMessage</td>
        <td>String</td>
        <td>Contains the error message</td>
    </tr>
    <tr>
        <td>xTokenType</td>
        <td>String</td>
        <td>Either card, cvv, or ach</td>
    </tr>
</table>

<br/><br/><br/>

---

**iFields Version:** [2.6.2006.0102](https://cdn.cardknox.com/ifields/versions.htm)