## React Legacy Mixin

This will let you use mixins with react classes.

It also autobinds any functions inside the react class.

Just include the function inside your class constructor..

```
import mixins from 'react-legacy-mixin';

export default class extends React.Component {
    constructor(props) {
        super(props);

        mixins(this, Mixin1, Mixin2);
    }
}
```