require 'rspec'
require 'watir-webdriver'
require 'json'

require './spec/e2e/support/helpers'

describe 'Home Page' do	
	
	before(:all) do
		puts "Configuration browser: #{RSpec.configuration.browser}"
		@browser = Watir::Browser.new RSpec.configuration.browser
		@h = TestHelper.new(@browser)
	end

	before(:each) do
		@browser.goto 'http://localhost:3000'
		# @browser.wait
	end

	# after(:each) do
	# 	@browser.reset!
	# end

	after(:all) do
		@browser.close
	end

	def check_initial_state
		expect(@h.get_elements('#main-menu li').length).to eq 3
		expect(@h.get_elements('#main-menu li .accordion-content.invisible').length).to eq 3
		expect(@h.get_elements('.product-grid ._product-summary').length).to eq 9
	end

	it 'Should load home page' do

		# Check initial state
		check_initial_state()

		# Click a random root category
		@h.click_element('#main-menu li .accordion-button')

		# Check navigation tree is unfolded
		expect(@h.get_elements('#main-menu li .accordion-content.invisible').length).to eq 2

	end

	it 'Should load home page and navigate to one category' do

		# Check initial state
		check_initial_state()

		# Get and click a random root category
		root_category = @h.get_random_element('#main-menu li')
		@h.click_element('.accordion-button', root_category)

		# Get and click a random subcategory
		subcategory = @h.get_random_element('._subcategory', root_category)
		@h.click_element(subcategory)

		# Check we've navigated to category page (page heading title matches and has products count element)
		@h.get_element('.products-count').wait_until_present
		expect(@h.get_element('#page-content > h1').text).to eq subcategory.text
		
	end

	it 'Should load home page and navigate to one main product' do

		# Check initial state
		check_initial_state()

		# Get and click a random main product
		product = @h.get_random_element('.product-grid ._product-summary')
		product_name = @h.get_element('h3', product).text
		@h.click_element(product)

		# Check we've navigated to product page (product name matches)
		@h.wait_for_element('#page-content.product-detail')
		expect(@h.get_element('#product-form > h1').text).to eq product_name

	end

end

# Watir-webdriver docs: http://www.rubydoc.info/gems/watir-webdriver/Watir
# Watir code: https://github.com/watir/watir-webdriver
# Homepages: http://watirwebdriver.com/ and http://watir.com/
