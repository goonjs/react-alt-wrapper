class ReactAltFactory {
    createWrapper(wrapperName, reactComponent, stores) {
        var wrapper = React.createClass({
            displayName: wrapperName,

            _storeListeners: {},

            getInitialState() {
                var state = {};

                _.each(stores, (store, name) => {
                    state[name] = store.getState()
                });

                return state;
            },

            onStoreUpdate(name, state) {
                this.setState({[name]: state});
            },

            componentWillMount() {
                _.each(stores, (store, name) => {
                    this._storeListeners[name] = this.onStoreUpdate.bind(this, name);
                    store.listen(this._storeListeners[name]);
                });
            },

            componentWillUnmount() {
                _.each(stores, (store, name) => {
                    store.unlisten(this._storeListeners[name]);
                });
            },

            render() {
                return React.createElement(reactComponent, this.state);
            }
        });

        return wrapper;
    }
}

var reactAltFactory = new ReactAltFactory;
