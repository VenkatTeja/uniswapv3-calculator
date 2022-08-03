import { useEffect } from "react";
import styled from "styled-components";
import { Heading } from "../../common/atomic";
import { useAppContext } from "../../context/app/appContext";
import { AppActionType } from "../../context/app/appReducer";
import { divideArray, findMax, findMin } from "../../utils/math";
import Slider from "./Slider";

const Group = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 8px;
  border-radius: 12px;
`;
const InputGroup = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 8px;
  border-radius: 12px;
  margin-top: 2px;
  position: relative;
  & > span {
    font-size: 0.8rem;
    text-align: center;
    color: #999;
    display: block;
    text-align: center;
  }
  & .btn {
    position: absolute;
    color: black;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    font-weight: bold;
    &:hover {
      background: white;
    }
  }
  & .btn-left {
    & span {
      transform: translate(0, -2px);
    }
  }
  & .btn-right {
    right: 8px;
    & span {
      transform: translate(0.2px, -1px);
    }
  }
`;
const Input = styled.input`
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  color: white;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 3px;

  &:focus {
    outline: none;
  }
`;
const MinMaxPriceContainer = styled.div`
  display: grid;
  grid-gap: 7px;
  grid-template-columns: repeat(2, 1fr);

  margin-bottom: 7px;
`;

const PriceRange = () => {
  const { state, dispatch } = useAppContext();

  const prices = divideArray(
    (state.token1PriceChart?.prices || []).map((p) => p.value),
    (state.token0PriceChart?.prices || []).map((p) => p.value)
  );

  const currentPrice = Number(state.pool?.token0Price || NaN);

  let _min = findMin(prices);
  let _max = findMax(prices);
  if (state.token0PriceChart === null || state.token1PriceChart === null) {
    _min = currentPrice - currentPrice * 0.3;
    _max = currentPrice + currentPrice * 0.3;
  }
  const margin = _max - _min;

  const min = Math.max(0, _min - margin);
  const max = _max + margin;
  const step = (max - min) / 10000000;
  const btnStep = ((max - min) * 2) / 100; // 2%

  useEffect(() => {
    if (Number.isNaN(currentPrice)) return;

    dispatch({
      type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
      payload: currentPrice,
    });
    dispatch({
      type: AppActionType.UPDATE_PRICE_RANGE,
      payload: [_min, _max],
    });
  }, [state.pool]);

  return (
    <div>
      <Heading>Price Range</Heading>
      <Group>
        <MinMaxPriceContainer>
          <InputGroup>
            <div
              className="btn btn-left"
              onClick={() => {
                dispatch({
                  type: AppActionType.UPDATE_PRICE_RANGE,
                  payload: [
                    state.priceRangeValue[0] - btnStep,
                    state.priceRangeValue[1],
                  ],
                });
              }}
            >
              <span>-</span>
            </div>
            <div
              className="btn btn-right"
              onClick={() => {
                dispatch({
                  type: AppActionType.UPDATE_PRICE_RANGE,
                  payload: [
                    state.priceRangeValue[0] + btnStep,
                    state.priceRangeValue[1],
                  ],
                });
              }}
            >
              <span>+</span>
            </div>
            <span>Min Price</span>
            <Input
              value={state.priceRangeValue[0]}
              type="number"
              placeholder="0.0"
              onChange={(e) => {
                let value = Number(e.target.value);

                dispatch({
                  type: AppActionType.UPDATE_PRICE_RANGE,
                  payload: [value, state.priceRangeValue[1]],
                });
              }}
            />
            <span>
              {state.token0?.symbol} per {state.token1?.symbol}
            </span>
          </InputGroup>
          <InputGroup>
            <div
              className="btn btn-left"
              onClick={() => {
                dispatch({
                  type: AppActionType.UPDATE_PRICE_RANGE,
                  payload: [
                    state.priceRangeValue[0],
                    state.priceRangeValue[1] - btnStep,
                  ],
                });
              }}
            >
              <span>-</span>
            </div>
            <div
              className="btn btn-right"
              onClick={() => {
                dispatch({
                  type: AppActionType.UPDATE_PRICE_RANGE,
                  payload: [
                    state.priceRangeValue[0],
                    state.priceRangeValue[1] + btnStep,
                  ],
                });
              }}
            >
              <span>+</span>
            </div>
            <span>Max Price</span>
            <Input
              value={state.priceRangeValue[1]}
              type="number"
              placeholder="0.0"
              onChange={(e) => {
                let value = Number(e.target.value);

                dispatch({
                  type: AppActionType.UPDATE_PRICE_RANGE,
                  payload: [state.priceRangeValue[0], value],
                });
              }}
            />
            <span>
              {state.token0?.symbol} per {state.token1?.symbol}
            </span>
          </InputGroup>
        </MinMaxPriceContainer>
        <Slider
          thumbClassName="thumb-green"
          value={state.priceRangeValue}
          min={min}
          max={max}
          step={step}
          onChange={(value, _) => {
            dispatch({
              type: AppActionType.UPDATE_PRICE_RANGE,
              payload: value,
            });
          }}
        />
      </Group>

      <Group style={{ marginTop: 7 }}>
        <InputGroup>
          <div
            className="btn btn-left"
            onClick={() => {
              dispatch({
                type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                payload: state.priceAssumptionValue - btnStep,
              });
            }}
          >
            <span>-</span>
          </div>
          <div
            className="btn btn-right"
            onClick={() => {
              dispatch({
                type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                payload: state.priceAssumptionValue + btnStep,
              });
            }}
          >
            <span>+</span>
          </div>
          <span>Most Active Price Assumption</span>
          <Input
            value={state.priceAssumptionValue || 0}
            type="number"
            placeholder="0.0"
            onChange={(e) => {
              let value = Number(e.target.value);

              dispatch({
                type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                payload: value,
              });
            }}
          />
          <span>
            {state.token0?.symbol} per {state.token1?.symbol}
          </span>
        </InputGroup>
        <Slider
          thumbClassName="thumb-red"
          value={state.priceAssumptionValue}
          min={min}
          max={max}
          step={step}
          onChange={(value, _) => {
            dispatch({
              type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
              payload: value,
            });
          }}
        />
      </Group>
    </div>
  );
};

export default PriceRange;
