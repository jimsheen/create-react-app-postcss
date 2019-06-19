import React from 'react';
import { shallow } from 'enzyme';
import RenderHelper from './util/renderHelper';

import Pagination from '../Pagination';

const markup = (props) => {
  return shallow(
    <Pagination { ...props } />
  )
}

let filterObj = {
  currentPage: 1,
  totalPages: 1,
}

const initialProps = {
  onClick: jest.fn((e) => e),
  filterObj,
}

const pagination = '[data-test="pagination"]';
const firstBtn = '[data-test="first-btn"]';
const prevBtn = '[data-test="prev-btn"]';
const lastBtn = '[data-test="last-btn"]';
const nextBtn = '[data-test="next-btn"]';

const pageBtn = (number) => `[data-test="pagination-number-${number}"]`;

let wrapper, defaultRender, render, instance;

beforeEach(() => {
  wrapper = new RenderHelper(initialProps, markup);
  defaultRender = wrapper.render();
  instance = defaultRender.instance();
})

it("Should render pagination", () => {
  expect(defaultRender.length).toBe(1);
})

it("Should not render anything when filterObj is null", () => {
  render = wrapper.render({ filterObj: {}, onClick: jest.fn(() => null) });
  expect(render).toEqual({});
});


describe('Pagination rendering', () => {

  describe('One page', () => {
    it('Should NOT render one page button', () => {
      expect(defaultRender.find(pageBtn(1)).length).toBe(0);
    });

    it('Should not render prev next first or last buttons', () => {
      expect(defaultRender.find(firstBtn).length).toBe(0);
      expect(defaultRender.find(lastBtn).length).toBe(0);
      expect(defaultRender.find(nextBtn).length).toBe(0);
      expect(defaultRender.find(prevBtn).length).toBe(0);
    });

  });

  describe('Two pages', () => {

    beforeEach(() => {
      filterObj = {
        currentPage: 1,
        totalPages: 2,
      };
      render = wrapper.render({ filterObj });
    })

    it('Should render two page buttons', () => {
      expect(render.find(pageBtn(1)).length).toBe(1);
      expect(render.find(pageBtn(2)).length).toBe(1);
    });

    it('Should render next and last buttons', () => {
      expect(render.find(nextBtn).length).toBe(1);
      expect(render.find(lastBtn).length).toBe(1);
    })

    it('Should not render prev and last buttons', () => {
      expect(render.find(prevBtn).length).toBe(0);
      expect(render.find(firstBtn).length).toBe(0);
    })

    it('should render prev and last buttons when currentPage is 2', () => {
      filterObj.currentPage = 2;
      render = wrapper.render({ filterObj });
      expect(render.find(prevBtn).length).toBe(1);
      expect(render.find(firstBtn).length).toBe(1);
    });

    it('should not render next and last buttons when currentPage is 2', () => {
      filterObj.currentPage = 2;
      render = wrapper.render({ filterObj });
      expect(render.find(nextBtn).length).toBe(0);
      expect(render.find(lastBtn).length).toBe(0);
    })
  });

  describe('More than ten pages', () => {

    beforeEach(() => {
      filterObj = {
        currentPage: 1,
        totalPages: 11,
      };
      render = wrapper.render({ filterObj });
    })

    it('should render 10th button and not 11th button', () => {
      expect(render.find(pageBtn(10)).length).toBe(1);
      expect(render.find(pageBtn(11)).length).toBe(0);
    })

    it('should not render 1st button and should render 11th button when currentPage is more than 6 AND should render pagination buttons', () => {
      filterObj.currentPage = 7;
      render = wrapper.render({ filterObj });
      expect(render.find(pageBtn(1)).length).toBe(0);
      expect(render.find(pageBtn(2)).length).toBe(1);
      expect(render.find(pageBtn(11)).length).toBe(1);

      expect(render.find(prevBtn).length).toBe(1);
      expect(render.find(firstBtn).length).toBe(1);
      expect(render.find(nextBtn).length).toBe(1);
      expect(render.find(lastBtn).length).toBe(1);
    })

  });

  describe('Interactivity', () => {

    describe('first, prev, next and last buttons', () => {

      beforeEach(() => {
        filterObj = {
          currentPage: 2,
          totalPages: 10,
        };
        render = wrapper.render({
          ...initialProps,
          filterObj
        })
        instance = render.instance();
      })

      it('should go to first page', () => {
        render.find(firstBtn).simulate('click');
        expect(render.find(firstBtn).props().value).toBe(1);
      })


      it('should go to prev page', () => {
        render.find(prevBtn).simulate('click');
        expect(render.find(firstBtn).props().value).toBe(filterObj.currentPage - 1);
      })

      it('should go to last page', () => {
        render.find(lastBtn).simulate('click');
        expect(render.find(lastBtn).props().value).toBe(filterObj.totalPages);
      })

      it('should go to next page', () => {
        render.find(nextBtn).simulate('click');
        expect(render.find(nextBtn).props().value).toBe(filterObj.currentPage + 1);
      })

    })

  })

});
