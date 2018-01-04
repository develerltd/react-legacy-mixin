const reactClasses = {
    'componentWillMount': true,
    'componentDidMount': true,
    'render': true,
    'constructor': true,
    'componentWillReceiveProps': true,
    'componentDidUpdate': true,
    'shouldComponentUpdate': true
};

export default function(context, ...args) {
    const newFns = {};

    Object.getOwnPropertyNames(Object.getPrototypeOf(context)).forEach(key => {
        if (typeof(context[key]) === 'function') {
            if (!reactClasses.hasOwnProperty(key)) {
                context[key] = context[key].bind(context);
            }
        }
    });

    args.forEach((mix) => {
        Object.keys(mix).forEach((key) => {
            if (key === 'getInitialState') {
                context.state = mix[key]();
            } else {
                if (typeof(mix[key]) === 'function') {
                    const list = newFns[key] || [];
                    list.push(mix[key].bind(context));
                    newFns[key] = list;
                } else {
                    context[key] = mix[key];
                }
            }
        });
    });

    Object.keys(newFns).map(key => {
        const fnList = newFns[key],
            oldFn = context[key] && context[key].bind(context),
            fnCount = (oldFn?1:0) + fnList.length;

        context[key] = function(...args) {
            if (fnCount > 1) {
                fnList.forEach(function(fn) {
                    fn(...args);
                });

                oldFn && oldFn(...args);
            } else {
                return oldFn?oldFn(...args):fnList[0](...args);
            }
        };
    });
}
