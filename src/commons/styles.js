import Colors from '../theme/colors';
import { wp } from './responsive';

export const lh = num => {
  return {
    lineHeight: wp(num),
  };
};

export const mb = num => {
  return {
    marginBottom: wp(num),
  };
};

export const mr = num => {
  return {
    marginRight: wp(num),
  };
};

export const mt = num => {
  return {
    marginTop: wp(num),
  };
};

export const ml = num => {
  return {
    marginLeft: wp(num),
  };
};

export const pdV = num => {
  return {
    paddingVertical: wp(num),
  };
};

export const pdH = num => {
  return {
    paddingHorizontal: wp(num),
  };
};

export const pb = num => {
  return {
    paddingBottom: wp(num),
  };
};

export const pr = num => {
  return {
    paddingRight: wp(num),
  };
};

export const pt = num => {
  return {
    paddingTop: wp(num),
  };
};

export const pl = num => {
  return {
    paddingLeft: wp(num),
  };
};

export const squareSize = num => {
  return {
    width: wp(num),
    height: wp(num),
  };
};

export const wid = num => {
  return {
    width: wp(num),
  };
};

export const flexRow = {
  flexDirection: 'row',
};

export const flexWrap = {
  flexWrap: 'wrap',
};

export const alignCenter = {
  alignItems: 'center',
};

export const justifyStart = {
  justifyContent: 'flex-start',
};

export const justifyEnd = {
  justifyContent: 'flex-end',
};

export const justifyCenter = {
  justifyContent: 'center',
};

export const justifyBetween = {
  justifyContent: 'space-between',
};

export const grow = num => ({
  flexGrow: num,
});

export const basis = num => ({
  flexBasis: num,
});

export const bgWhite = {
  backgroundColor: Colors.white,
};

export const fontSize = size => ({
  fontSize: wp(size),
});

export const hei = size => ({
  height: wp(size),
});

export const bdr = size => ({
  borderRadius: wp(size),
});

export const opa = num => ({
  opacity: wp(num),
});

export const bgColor = color => ({
  backgroundColor: color,
});

export const flex1 = {
  flex: 1,
};
