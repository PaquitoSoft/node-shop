require 'rspec'
require 'watir-webdriver'

describe 'Home Page' do	
	
	$browser = nil	

	def get_elements(selector, parent_element = $browser)
		parent_element.elements :css => selector
	end

	def get_element(selector, parent_element = $browser, wait = false)
		wait_for_element if wait
		parent_element.element :css => selector
	end

	def get_random_element(elementsOrSelector, parent_element = $browser)
		elements = elementsOrSelector
		if elements.instance_of? String then
			elements = get_elements(elementsOrSelector, parent_element)
		end
		elements[rand(elements.length)]
	end

	def wait_for_element(selector)
		get_element(selector).wait_until_present(5)
	end

	def click_element(elementOrSelector, parent_element = $browser)
		element = elementOrSelector
		if element.instance_of? String then
			element = get_element(elementOrSelector, parent_element)
		end
		element.wait_until_present(5)
		element.click
	end

	def check_initial_state
		expect(get_elements('#main-menu li').length).to eq 3
		expect(get_elements('#main-menu li .accordion-content.invisible').length).to eq 3
		expect(get_elements('.product-grid ._product-summary').length).to eq 9
	end

	before(:all) do
		$browser = Watir::Browser.new :chrome
	end

	before(:each) do
		$browser.goto 'http://localhost:3000'
		$browser.wait
	end

	# after(:each) do
	# 	$browser.reset!
	# end

	after(:all) do
		$browser.close
	end

	it 'Should load home page' do

		# Check initial state
		check_initial_state()

		# Click a random root category
		click_element('#main-menu li .accordion-button')

		# Check navigation tree is unfolded
		expect(get_elements('#main-menu li .accordion-content.invisible').length).to eq 2

	end

	it 'Should load home page and navigate to one category' do

		# Check initial state
		check_initial_state()

		# Get and click a random root category
		root_category = get_random_element('#main-menu li')
		puts "Selected root category: #{root_category.text}"
		click_element('.accordion-button', root_category)

		# Get and click a random subcategory
		subcategory = get_random_element('._subcategory', root_category)
		click_element(subcategory)

		# Check we've navigated to category page (page heading title matches and has products count element)
		get_element('.products-count').wait_until_present
		expect(get_element('#page-content > h1').text).to eq subcategory.text
		
	end

	it 'Should load home page and navigate to one main product' do

		# Check initial state
		check_initial_state()

		# Get and click a random main product
		product = get_random_element('.product-grid ._product-summary')
		product_name = get_element('h3', product).text
		click_element(product)

		# Check we've navigated to product page (product name matches)
		wait_for_element('#page-content.product-detail')
		expect(get_element('#product-form > h1').text).to eq product_name

	end

end

# Watir-webdriver docs: http://www.rubydoc.info/gems/watir-webdriver/Watir
# Watir code: https://github.com/watir/watir-webdriver
# Homepages: http://watirwebdriver.com/ and http://watir.com/
