import React, { PureComponent } from 'react';
import '../assets/css/Thumbnail.css';
import './App';

import Sortable from 'react-sortablejs';
import gql from "graphql-tag";

//Global const:
const FPS = 25;

//Redux:
import { connect } from "react-redux";

//Utils:
import LoadThumbs from '../util/LoadThumbs';


class Thumbnail extends PureComponent {
    //Props:
    // ccgOutputProps={item.key} what output on CCG to play at
    // ccgConnectionProps={this.ccgConnection} Current CCG connection object
    // loadMediaProps={this.loadMedia.bind(this)}
    // loadBgMediaProps={this.loadBgMedia.bind(this)}
    // updatePlayingStatusProps={this.updatePlayingStatus.bind(this)}


    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.ccgMediaFilesChanges = this.ccgMediaFilesChanged.bind(this);

        this.loadThumbs = new LoadThumbs(this.props.ccgConnectionProps, this.props.ccgOutputProps);
        this.loadThumbs.loadThumbs();
        this.props.updatePlayingStatusProps (this.props.ccgOutputProps - 1);
    }

    componentDidMount() {
        this.ccgMediaFilesChanged();
    }

    ccgMediaFilesChanged() {
        var _this2 = this;
        //Subscribe to CasparCG-State changes:
        window.__APOLLO_CLIENT__.subscribe({
            query: gql`
                subscription {
                    mediaFilesChanged
                }`
        })
        .subscribe({
            next(response) {
                console.log("Media Files Changed");
                _this2.loadThumbs.loadThumbs();
            },
            error(err) { console.error('Subscription error: ', err); },
        });
    }

    onDragEnd(order, sortable, evt) {
        console.log("DRAGGED: ", evt);
        this.props.dispatch({
            type: 'MOVE_THUMB_IN_LIST',
            data: {
                tab: this.props.store.appNav[0].appNav.activeTab,
                source: evt.oldIndex,
                destination: evt.newIndex
            }
        });
        thumbsOrder.map((thumbOrder) => {
            window.store.dispatch({
                type:'SET_THUMB_ORDER',
                channel: this.props.ccgOutputProps,
                thumborder: this.props.store.data[0].channel[this.props.ccgOutputProps-1].thumbList
            });
        });
    this.props.updatePlayingStatusProps(this.props.ccgOutputProps-1);
    }

    renderThumb(item, index) {
        return (
            <div>
                <img src={item.thumbPix}
                    className="thumbnailImage"
                    style = {Object.assign({},
                        item.tally ?
                            {borderWidth: '4px'} : {borderWidth: '0px'},
                        item.tallyBg ?
                            {boxShadow: '0px 0px 1px 5px green'} : {boxShadow: ''}
                    )}
                />
                <button className="thumbnailImageClickPvw"
                    onClick={() => this.props.loadBgMediaProps(this.props.ccgOutputProps, 10, index)}
                />
                <button className="thumbnailImageClickPgm"
                    onClick={() => this.props.loadMediaProps(this.props.ccgOutputProps, 10, index)}
                />
                <a className="playing">
                    {item.tally ?
                        this.props.store.data[0].ccgTimeCounter[this.props.ccgOutputProps-1]
                        : ""
                    }
                </a>
                <p className="text">
                    {item.name.substring(item.name.lastIndexOf('/')+1).slice(-45)}
                </p>
            </div>
        )

    }

    render() {
        return (
            <Sortable
                className="flexBoxes"
                onChange={(order, sortable, evt) => {
                    this.onDragEnd(order, sortable, evt);
                }}
            >
                {this.props.store.data[0].channel[this.props.ccgOutputProps-1].thumbList
                .map((item, index) => (
                    <div
                        className="boxComponent"
                        key={"item" + index}
                    >
                        { this.renderThumb(item, index) }
                    </div>
                ))}
            </Sortable>

        )
    }
}


const mapStateToProps = (state) => {
    return {
        store: state
    }
}

export default connect(mapStateToProps, null, null, {forwardRef : true})(Thumbnail);
