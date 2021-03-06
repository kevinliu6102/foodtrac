import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardTitle, CardText, CardHeader, Dialog, FlatButton, TextField } from 'material-ui';
import { Grid, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import propSchema from '../common/PropTypes';
import CartEntry from './CartEntry';
import SelectCoupons from './SelectCoupons';
import { actions as userActions } from '../../redux/user';

class OrderSummary extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      name: '',
      discount: 0,
    };
    this.calculateTotal = this.calculateTotal.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.orderComplete = this.orderComplete.bind(this);
    this.handleDiscount = this.handleDiscount.bind(this);
  }

  handleDiscount(val) {
    this.setState({ discount: val });
  }

  changeName(val) {
    const name = val;
    this.setState({ name });
  }

  calculateTotal() {
    let total = 0;
    let currCoupon;
    const reward = this.brandReward();
    this.props.currentOrder.forEach((item) => {
      total += (item.price / 100) * item.quantity;
    });

    if (reward) {
      reward.user_coupons.forEach((coupon) => {
        if (coupon.id === this.state.discount) {
          currCoupon = coupon;
        }
      });
      if (currCoupon) {
        if (this.state.discount > 0) {
          if (currCoupon.coupons[0].flat_discount > 0) {
            total -= currCoupon.coupons[0].flat_discount;
          } else {
            total -= (total * (currCoupon.coupons[0].percent_discount / 100));
          }
        }
      }
    }
    return total;
  }

  submitOrder() {
    const orderItems = this.props.currentOrder.reduce((acc, item) => {
      for (let i = 0; i < item.quantity; i++) {
        acc.push({ menu_item_id: item.menu_item_id });
      }
      return acc;
    }, []);
    const order = {
      user_id: this.props.userId,
      truck_id: this.props.truck.id,
      date: new Date().toISOString(),
      ready: false,
      name: this.state.name,
      orderitems: orderItems,
    };
    if (this.state.discount > 0) {
      order.user_coupon_id = this.state.discount;
    }
    axios.post(`/api/foodtrucks/${this.props.truck.id}/orders`, order)
      .then(() => this.orderComplete())
      .catch(e => console.log(e));
    this.handleRewards();
  }

  brandReward() {
    let userReward = null;
    this.props.userRewards.forEach((reward) => {
      if (reward.brand_id === this.props.truck.brands.id) {
        userReward = Object.assign({}, reward);
      }
    });
    return userReward;
  }

  redeemCoupon() {
    if (this.state.discount > 0) {
      axios.put(`/api/rewards/${this.state.discount}`, { redeemed: true })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  }

  handleRewards() {
    const userReward = this.brandReward();
    if (this.props.truck.brands.rewards_trigger > 0) {
      if (userReward) {
        if ((this.props.truck.brands.rewards_trigger - userReward.count) <= 1) {
          userReward.count = 0;
          const newCoupon = {
            redeemed: false,
            coupon_id: this.props.truck.brands.coupon.id,
            user_reward_id: userReward.id,
          };
          axios.post('/api/rewards/usercoupon', newCoupon)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        } else {
          userReward.count += 1;
        }
        const rewardUpdate = {
          brand_id: userReward.brand_id,
          user_id: userReward.user_id,
          count: userReward.count,
        };
        axios.post('/api/rewards', rewardUpdate)
          .then(() => {
            this.props.userActions.requestUserData(this.props.userId);
          })
          .catch(err => console.log(err));
      } else {
        const newReward = {
          brand_id: this.props.truck.brands.id,
          user_id: this.props.userId,
          count: 1,
        };
        console.log('about to post rewards');
        axios.post('/api/rewards', newReward)
          .then(() => {
            console.log('posted rewards');
            this.props.userActions.requestUserData(this.props.userId);
          })
          .catch(err => console.log(err));
      }
    }
    this.redeemCoupon();
  }

  orderComplete() {
    this.setState({ open: !this.state.open });
  }

  newCouponAlert() { // eslint-disable-line consistent-return
    if (this.brandReward()) {
      return (this.props.truck.brands.rewards_trigger - this.brandReward().count) <= 1
        ? <div>Congratulation! You will recieve a new coupon upon confirming your order!</div>
        : null;
    }
  }

  render() {
    const actions = [
      (this.state.name !== '' ?
        <Link to="/">
          <FlatButton
            label="Confirm Order"
            primary
            onClick={this.submitOrder}
          />
        </Link> : null
      ),
    ];
    return (
      <Col xs={12} sm={12} md={4} lg={4}>
        <Card className="summary">
          <CardTitle title="Order Summary" />
          <Grid fluid>
            {this.props.currentOrder.map((currentItem, i) =>
              (<CartEntry
                key={i} // eslint-disable-line react/no-array-index-key
                index={i}
                currentItem={currentItem}
                removeFromOrder={this.props.removeFromOrder}
              />),
            )}
          </Grid>
          {this.props.truck.brands.rewards_trigger > 0 ?
            <div>
              {this.brandReward()
                ? <CardText>{`${this.props.truck.brands.rewards_trigger - this.brandReward().count} more orders before your free coupon!`}</CardText>
                : null}
            </div> : null
          }
          {this.brandReward()
            ? <SelectCoupons
              coupons={this.brandReward().user_coupons}
              handleDiscount={this.handleDiscount}
              discount={this.state.discount}
            />
            : null
          }
          <CardHeader
            title={`Total: $${this.calculateTotal()}`}
            subtitle="+ tax"
          />
          {this.props.currentOrder.length > 0 ?
            <FlatButton
              label="Submit Order"
              onClick={this.orderComplete}
            /> : null
          }
          <Dialog
            title="Your order is complete!"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.orderComplete}
          >
            {this.newCouponAlert()}
            <TextField
              floatingLabelText="Give us your name"
              hintText="name"
              onChange={(e, val) => this.changeName(val)}
              value={this.state.name}
            />
          </Dialog>
        </Card>
      </Col>
    );
  }
}

OrderSummary.propTypes = {
  currentOrder: propSchema.currentOrder,
  truck: propSchema.truck,
  userId: propSchema.userId,
  removeFromOrder: propSchema.removeComment,
  userRewards: propSchema.userRewards,
  userActions: propSchema.userActions,
};

const mapStateToProps = ({ user }) => {
  const userId = user.id;
  const userRewards = user.user_rewards;
  return { userId, userRewards };
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
