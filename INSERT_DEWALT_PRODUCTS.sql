DELETE FROM products WHERE brand = 'DeWalt';

INSERT INTO products (name, slug, brand, model, category, subcategory, voltage, price, stock, active, images, badge, rating, review_count, description, metadata)
VALUES
  ('DeWalt 12V Compact Drill', 'dce555', 'DeWalt', 'DCE555', 'drills', 'drill-driver', '12V', 15000, 3, true, ARRAY[]::text[], NULL, 4.5, 0, 'Compact 12V drill/driver', '{"weight_lbs": 2.5}'),
  ('DeWalt 12V Compact Impact Driver', 'dcf630', 'DeWalt', 'DCF630', 'drills', 'impact-driver', '12V', 15000, 6, true, ARRAY[]::text[], NULL, 4.6, 0, '12V impact driver', '{"weight_lbs": 2.2}'),
  ('DeWalt 20V Battery Pack 1.5Ah', 'dcb615', 'DeWalt', 'DCB615', 'accessories', 'batteries', '20V', 30000, 2, true, ARRAY[]::text[], NULL, 4.7, 0, '20V 1.5Ah battery', '{"weight_lbs": 0.5}'),
  ('DeWalt 20V Battery Pack 1.3Ah', 'dcb606', 'DeWalt', 'DCB606', 'accessories', 'batteries', '20V', 12000, 8, true, ARRAY[]::text[], NULL, 4.7, 0, '20V 1.3Ah battery', '{"weight_lbs": 0.4}'),
  ('DeWalt 20V Battery Pack 2.0Ah', 'dcb209', 'DeWalt', 'DCB209', 'accessories', 'batteries', '20V', 16000, 5, true, ARRAY[]::text[], NULL, 4.8, 0, '20V 2.0Ah battery', '{"weight_lbs": 0.6}'),
  ('DeWalt 20V Battery Pack Charger', 'dcb2108', 'DeWalt', 'DCB2108', 'accessories', 'batteries', '20V', 13000, 4, true, ARRAY[]::text[], NULL, 4.6, 0, '20V battery and charger', '{"weight_lbs": 1.0}'),
  ('DeWalt 20V Rotary Hammer Drill', 'dch273b', 'DeWalt', 'DCH273B', 'drills', 'rotary-hammer', '20V', 30000, 1, true, ARRAY[]::text[], NULL, 4.8, 0, '20V SDS+ rotary hammer', '{"weight_lbs": 5.0, "max_torque": "1.1 ft-lbs"}'),
  ('DeWalt 20V Finish Nailer', 'dcn660d1', 'DeWalt', 'DCN660D1', 'nailers', 'finish-nailer', '20V', 30000, 3, true, ARRAY[]::text[], NULL, 4.8, 0, '16-gauge finish nailer', '{"weight_lbs": 6.4}'),
  ('DeWalt 20V LED Spotlight', 'dcl34031b', 'DeWalt', 'DCL34031B', 'accessories', 'lights', '20V', 36000, 2, true, ARRAY[]::text[], NULL, 4.7, 0, 'LED job site light', '{"weight_lbs": 0.8}'),
  ('DeWalt 20V LED Work Light', 'dcle34021d1', 'DeWalt', 'DCLE34021D1', 'accessories', 'lights', '20V', 25000, 2, true, ARRAY[]::text[], NULL, 4.6, 0, 'Dual-position LED light', '{"weight_lbs": 1.2}'),
  ('DeWalt 20V Oscillating Tool', 'dcs354', 'DeWalt', 'DCS354', 'saws', 'oscillating-tool', '20V', 10000, 2, true, ARRAY[]::text[], NULL, 4.6, 0, 'Multi-tool oscillating', '{"weight_lbs": 3.0}'),
  ('DeWalt 20V Random Orbit Sander', 'dcw210', 'DeWalt', 'DCW210', 'sanders', 'random-orbit', '20V', 10000, 4, true, ARRAY[]::text[], NULL, 4.6, 0, '5" random orbital sander', '{"weight_lbs": 2.8}'),
  ('DeWalt 20V Impact Driver', 'dcf887', 'DeWalt', 'DCF887', 'drills', 'impact-driver', '20V', 11000, 5, true, ARRAY[]::text[], NULL, 4.9, 0, '1825 in-lbs impact driver', '{"weight_lbs": 2.2, "max_torque": "1825 in-lbs"}'),
  ('DeWalt 20V Battery Pack 5.0Ah', 'dcb999', 'DeWalt', 'DCB999', 'accessories', 'batteries', '20V', 12000, 8, true, ARRAY[]::text[], NULL, 4.8, 0, '20V 5.0Ah battery', '{"weight_lbs": 0.9}'),
  ('DeWalt 20V Jigsaw', 'dcs335', 'DeWalt', 'DCS335', 'saws', 'jigsaw', '20V', 15000, 2, true, ARRAY[]::text[], NULL, 4.7, 0, 'Compact jigsaw', '{"weight_lbs": 3.5}'),
  ('DeWalt 4.5" Angle Grinder', 'dcg418', 'DeWalt', 'DCG418', 'grinders', 'angle-grinder', 'Corded', 16000, 3, true, ARRAY[]::text[], NULL, 4.6, 0, '4.5" corded angle grinder', '{"weight_lbs": 5.0, "amps": 13}'),
  ('DeWalt 20V Reciprocating Saw', 'dcs368', 'DeWalt', 'DCS368', 'saws', 'reciprocating-saw', '20V', 16000, 3, true, ARRAY[]::text[], NULL, 4.7, 0, 'Compact recip saw', '{"weight_lbs": 6.8}'),
  ('DeWalt 20V Compact Jigsaw', 'dcs308', 'DeWalt', 'DCS308', 'saws', 'jigsaw', '20V', 10000, 2, true, ARRAY[]::text[], NULL, 4.6, 0, 'Compact jigsaw', '{"weight_lbs": 3.2}'),
  ('DeWalt 20V Belt Sander', 'dcw600b', 'DeWalt', 'DCW600B', 'sanders', 'belt-sander', '20V', 15000, 2, true, ARRAY[]::text[], NULL, 4.7, 0, '3x18" belt sander', '{"weight_lbs": 6.2}'),
  ('DeWalt Self-Leveling Laser', 'dw088cg', 'DeWalt', 'DW088CG', 'measuring', 'laser-level', 'Battery', 16000, 2, true, ARRAY[]::text[], NULL, 4.7, 0, 'Green cross-line laser', '{"weight_lbs": 1.5}'),
  ('DeWalt 20V Brad Nailer', 'dcn623d1', 'DeWalt', 'DCN623D1', 'nailers', 'brad-nailer', '20V', 20000, 2, true, ARRAY[]::text[], NULL, 4.7, 0, 'Cordless brad nailer', '{"weight_lbs": 5.5}'),
  ('DeWalt 20V Compact Driver Drill', 'dcf923b', 'DeWalt', 'DCF923B', 'drills', 'drill-driver', '20V', 18000, 3, true, ARRAY[]::text[], NULL, 4.7, 0, '18V compact drill/driver', '{"weight_lbs": 2.1}'),
  ('DeWalt 20V Cordless Nailer', 'dcn45rn', 'DeWalt', 'DCN45RN', 'nailers', 'pin-nailer', '20V', 25000, 2, true, ARRAY[]::text[], NULL, 4.6, 0, 'Pin nailer', '{"weight_lbs": 4.0}'),
  ('DeWalt 20V Finish Nailer Kit', 'dcn681', 'DeWalt', 'DCN681', 'nailers', 'finish-nailer', '20V', 22000, 3, true, ARRAY[]::text[], NULL, 4.8, 0, '18-gauge finish nailer', '{"weight_lbs": 5.8}'),
  ('DeWalt 20V Framing Nailer', 'dcn920', 'DeWalt', 'DCN920', 'nailers', 'framing-nailer', '20V', 30000, 3, true, ARRAY[]::text[], NULL, 4.9, 0, 'Cordless framing nailer', '{"weight_lbs": 8.5}');

SELECT COUNT(*) as total_products, brand FROM products WHERE brand = 'DeWalt' GROUP BY brand;
