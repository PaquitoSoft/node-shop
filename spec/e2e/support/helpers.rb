require 'watir-webdriver'
require 'watir-webdriver-performance' # http://watirwebdriver.com/page-performance/

class TestHelper

	attr_reader :browser

	def initialize(browser_name)
		@browser_name = browser_name
		@browser = Watir::Browser.new browser_name
	end

	def get_elements(selector, parent_element = @browser)
		parent_element.elements :css => selector
	end

	def get_element(selector, parent_element = @browser, wait = false)
		wait_for_element if wait
		parent_element.element :css => selector
	end

	def get_random_element(elementsOrSelector, parent_element = @browser)
		elements = elementsOrSelector
		if elements.instance_of? String then
			elements = get_elements(elementsOrSelector, parent_element)
		end
		elements[rand(elements.length)]
	end

	def wait_for_element(selector)
		get_element(selector).wait_until_present(5)
	end

	def click_element(elementOrSelector, parent_element = @browser)
		element = elementOrSelector
		if element.instance_of? String then
			element = get_element(elementOrSelector, parent_element)
		end
		element.wait_until_present(5)
		element.click
	end

end
